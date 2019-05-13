/*
 * Copyright (c) 2017, 2017, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */
package com.oracle.svm.reflect.hosted;

import org.graalvm.compiler.api.replacements.SnippetReflectionProvider;
import org.graalvm.compiler.nodes.graphbuilderconf.InvocationPlugins;
import org.graalvm.compiler.options.Option;
import org.graalvm.compiler.options.OptionType;
import org.graalvm.compiler.phases.util.Providers;
import org.graalvm.nativeimage.ImageSingletons;
import org.graalvm.nativeimage.impl.RuntimeReflectionSupport;

import com.oracle.svm.core.annotate.AutomaticFeature;
import com.oracle.svm.core.graal.GraalFeature;
import com.oracle.svm.core.option.HostedOptionKey;
import com.oracle.svm.hosted.FallbackFeature;
import com.oracle.svm.hosted.FeatureImpl.DuringSetupAccessImpl;
import com.oracle.svm.hosted.ImageClassLoader;
import com.oracle.svm.hosted.analysis.Inflation;
import com.oracle.svm.hosted.config.ConfigurationDirectories;
import com.oracle.svm.hosted.config.ConfigurationParser;
import com.oracle.svm.hosted.config.ReflectionConfigurationParser;
import com.oracle.svm.hosted.snippets.ReflectionPlugins;
import com.oracle.svm.hosted.substitute.AnnotationSubstitutionProcessor;

@AutomaticFeature
public final class ReflectionFeature implements GraalFeature {

    private AnnotationSubstitutionProcessor annotationSubstitutions;

    public static class Options {
        @Option(help = "file:doc-files/ReflectionConfigurationFilesHelp.txt", type = OptionType.User)//
        public static final HostedOptionKey<String[]> ReflectionConfigurationFiles = new HostedOptionKey<>(null);

        @Option(help = "Resources describing program elements to be made available for reflection (see ReflectionConfigurationFiles).", type = OptionType.User)//
        public static final HostedOptionKey<String[]> ReflectionConfigurationResources = new HostedOptionKey<>(null);
    }

    private ReflectionDataBuilder reflectionData;
    private ImageClassLoader loader;
    private boolean configedByAnnotations;

    @Override
    public void duringSetup(DuringSetupAccess a) {
        DuringSetupAccessImpl access = (DuringSetupAccessImpl) a;

        ReflectionSubstitution subst = new ReflectionSubstitution(access.getMetaAccess().getWrapped(), access.getHostVM().getClassInitializationSupport(), access.getImageClassLoader());
        access.registerSubstitutionProcessor(subst);
        ImageSingletons.add(ReflectionSubstitution.class, subst);

        reflectionData = new ReflectionDataBuilder();
        ImageSingletons.add(RuntimeReflectionSupport.class, reflectionData);

        ReflectionConfigurationParser<Class<?>> parser = ReflectionConfigurationParser.create(reflectionData, access.getImageClassLoader());
        configedByAnnotations = parser.parseAndRegisterFromTypeAnnotation();
        ConfigurationParser.parseAndRegisterConfigurations(parser, access.getImageClassLoader(), "reflection",
                        Options.ReflectionConfigurationFiles, Options.ReflectionConfigurationResources, ConfigurationDirectories.FileNames.REFLECTION_NAME);
        loader = access.getImageClassLoader();
        annotationSubstitutions = ((Inflation) access.getBigBang()).getAnnotationSubstitutionProcessor();
    }

    @Override
    public void duringAnalysis(DuringAnalysisAccess access) {
        reflectionData.duringAnalysis(access);
    }

    @Override
    public void afterAnalysis(AfterAnalysisAccess access) {
        reflectionData.afterAnalysis();
    }

    @Override
    public void beforeCompilation(BeforeCompilationAccess access) {
        FallbackFeature.FallbackImageRequest reflectionFallback = ImageSingletons.lookup(FallbackFeature.class).reflectionFallback;

        if (reflectionFallback != null && !configedByAnnotations && Options.ReflectionConfigurationFiles.getValue() == null && Options.ReflectionConfigurationResources.getValue() == null) {
            throw reflectionFallback;
        }
    }

    @Override
    public void registerInvocationPlugins(Providers providers, SnippetReflectionProvider snippetReflection, InvocationPlugins invocationPlugins, boolean analysis, boolean hosted) {
        /*
         * The reflection invocation plugins need to be registered only when reflection is enabled
         * since it adds Field and Method objects to the image heap which otherwise are not allowed.
         */
        ReflectionPlugins.registerInvocationPlugins(loader, snippetReflection, annotationSubstitutions, invocationPlugins, analysis, hosted);
    }
}
