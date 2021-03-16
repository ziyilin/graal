/*
 * Copyright (c) 2021, 2021, Oracle and/or its affiliates. All rights reserved.
 * Copyright (c) 2021, 2021, Alibaba Group Holding Limited. All rights reserved.
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
package com.oracle.svm.hosted.classinitialization;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ClassInitializationStatistics {
    private static Map<String, ClassInitalizerHasSideEffectsException> classWithSideEffects = new ConcurrentHashMap<>();
    private static Map<String, NoClassDefFoundError> classDefErrors = new ConcurrentHashMap<>();
    private static Map<String, Throwable> classWithOtherErrors = new ConcurrentHashMap<>();

    @SuppressWarnings({"rawtypes", "unchecked"})
    private static Map<String, ? extends Throwable>[] delayedReasons = new Map[]{classWithSideEffects, classDefErrors, classWithOtherErrors};

    public static void addDelayedInitializationReason(String className, Throwable t) {
        String qualifiedName;
        if (className.startsWith("L") && className.endsWith(";")) {
            qualifiedName = className.substring(1, className.length() - 1);
            qualifiedName = qualifiedName.replace('/', '.');
        } else {
            qualifiedName = className;
        }
        if (t instanceof ClassInitalizerHasSideEffectsException) {
            classWithSideEffects.put(qualifiedName, (ClassInitalizerHasSideEffectsException) t);
        } else if (t instanceof NoClassDefFoundError) {
            classDefErrors.put(className, (NoClassDefFoundError) t);
        } else {
            classWithOtherErrors.put(className, t);
        }
    }

    public static boolean hasSideEffect(Class<?> c) {
        return classWithSideEffects.containsKey(c.getName());
    }

    public static String getDelayedReason(String className) {
        for (Map<String, ? extends Throwable> map : delayedReasons) {
            if (map.containsKey(className)) {
                return map.get(className).getMessage();
            }
        }
        return null;
    }
}
