package com.alibaba.ajdk.annotations;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

@Retention(RUNTIME)
@Target(TYPE)
@Repeatable(Reflects.class)
public @interface ContainReflection {
    String value();

    boolean allDeclaredFields() default false;
}
