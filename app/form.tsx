// SignupScreen.tsx

import React from 'react';
import { Alert, Platform, View } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardController,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { Button } from '~/components/nativewindui/Button';
import { DatePicker } from '~/components/nativewindui/DatePicker';
import {
  Form,
  FormItem,
  FormSection,
  FormTextField,
  pickFields,
} from '~/components/nativewindui/Form';
import { Picker, PickerItem } from '~/components/nativewindui/Picker';
import { Text } from '~/components/nativewindui/Text';

const SignupSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required.' }),
    lastName: z.string().min(1, { message: 'Last name is required.' }),
    brithday: z.date({
      required_error: 'Birthday is required.',
    }),
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z.string().min(1, { message: 'Confirm password is required.' }),
    luckyDigit: z.coerce
      .number({ message: 'Lucky number must be a number.' })
      .min(0, { message: 'Lucky number cannot be negative.' })
      .max(9, { message: 'Lucky number cannot be greater than 9.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  // birthday cannot be in the future
  .refine((data) => data.brithday < new Date(), {
    message: 'Birthday cannot be in the future.',
    path: ['brithday'],
  })
  // birthday must be at least 13 years ago
  .refine(
    (data) => data.brithday < new Date(new Date().setFullYear(new Date().getFullYear() - 13)),
    {
      message: 'You must be at least 13 years old.',
      path: ['brithday'],
    }
  );

type SignupFormValues = z.infer<typeof SignupSchema>;

export default function SignupScreen() {
  const insets = useSafeAreaInsets();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      brithday: new Date(),
      email: '',
      password: '',
      confirmPassword: '',
      luckyDigit: 0,
    },
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting, isDirty } = formState;

  const onSubmit = async (data: SignupFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    Alert.alert(
      'Form Data:',
      `First Name: ${data.firstName}\nLast Name: ${data.lastName}\nBirthday: ${data.brithday.toLocaleDateString()}\nEmail: ${data.email}\nPassword: ${data.password}\nConfirm Password: ${data.confirmPassword}\nLucky Number: ${data.luckyDigit}`
    );
  };

  const insertValidData = () => {
    form.setValue('firstName', 'John');
    form.setValue('lastName', 'Doe');
    form.setValue('brithday', new Date(1990, 0, 1));
    form.setValue('email', 'john.doe@example.com');
    form.setValue('password', 'password123');
    form.setValue('confirmPassword', 'password123');
    form.setValue('luckyDigit', 5, { shouldDirty: true });
  };

  return (
    <View
      className="ios:bg-card flex-1"
      style={{
        paddingBottom: insets.bottom,
      }}>
      <Stack.Screen
        options={{
          title: 'Form',
          headerRight: () => (
            <Button
              className="ios:px-0"
              disabled={isSubmitting}
              variant="plain"
              onPress={insertValidData}>
              <Text className="text-primary">Insert Data</Text>
            </Button>
          ),
        }}
      />
      <KeyboardAwareScrollView
        bottomOffset={Platform.select({ ios: 175 })}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled">
        <View className="flex-1 p-4">
          <View className="ios:pt-4 pt-6">
            <Form form={form} className="gap-2">
              <FormSection
                className="ios:bg-background"
                ios={{ title: 'Personal Information' }}
                fields={pickFields(form, ['firstName', 'lastName'])}>
                <FormItem>
                  <FormTextField name="firstName" placeholder="First Name" returnKeyType="next" />
                </FormItem>
                <FormItem>
                  <FormTextField name="lastName" placeholder="Last Name" returnKeyType="next" />
                </FormItem>
              </FormSection>

              <FormSection
                className="ios:bg-background"
                ios={{ title: 'Birthday' }}
                fields={pickFields(form, ['brithday'])}>
                <Controller
                  control={form.control}
                  name="brithday"
                  render={({ field: { value, onChange } }) => (
                    <FormItem className="ios:pl-2 flex-row items-center justify-between">
                      <Text className="text-[17px]">
                        Age: {new Date().getFullYear() - value.getFullYear()}
                      </Text>
                      <DatePicker
                        value={value}
                        mode="date"
                        onChange={(ev) => {
                          onChange(new Date(ev.nativeEvent.timestamp));
                        }}
                      />
                    </FormItem>
                  )}
                />
              </FormSection>

              <FormSection
                className="ios:bg-background"
                ios={{ title: 'Email' }}
                fields={pickFields(form, ['email'])}>
                <FormItem>
                  <FormTextField
                    name="email"
                    placeholder="Email"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    autoComplete="email"
                    returnKeyType="next"
                    autoCapitalize="none"
                  />
                </FormItem>
              </FormSection>

              <FormSection
                className="ios:bg-background"
                ios={{ title: 'Password' }}
                fields={pickFields(form, ['password', 'confirmPassword'])}>
                <FormItem>
                  <FormTextField
                    name="password"
                    placeholder="Password"
                    textContentType="newPassword"
                    secureTextEntry
                    returnKeyType="next"
                  />
                </FormItem>
                <FormItem>
                  <FormTextField
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    textContentType="newPassword"
                    secureTextEntry
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                </FormItem>
              </FormSection>

              <FormSection
                className="ios:bg-background"
                ios={{ title: 'Your Lucky Number' }}
                fields={pickFields(form, ['luckyDigit'])}>
                <Controller
                  control={form.control}
                  name="luckyDigit"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <Picker
                        style={{
                          backgroundColor: 'transparent',
                        }}
                        selectedValue={value}
                        onValueChange={onChange}>
                        {Array.from({ length: 10 }, (_, i) => (
                          <PickerItem key={i} label={i.toString()} value={i} />
                        ))}
                      </Picker>
                    </FormItem>
                  )}
                />
              </FormSection>
            </Form>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <KeyboardStickyView
        offset={{
          closed: 0,
          opened: Platform.select({
            ios: insets.bottom,
            default: insets.bottom,
          }),
        }}
        className="ios:bg-card bg-background">
        {Platform.OS === 'ios' ? (
          <View className="p-4">
            <Button size="lg" onPress={handleSubmit(onSubmit)} disabled={!isDirty || isSubmitting}>
              {isSubmitting ? <ActivityIndicator color="white" /> : null}
              <Text>Sign Up</Text>
            </Button>
          </View>
        ) : (
          <View className="flex-row justify-between py-4 pl-6 pr-8">
            <Button
              onPress={() => {
                KeyboardController.dismiss();
                handleSubmit(onSubmit);
              }}
              disabled={!isDirty || isSubmitting}>
              {isSubmitting ? <ActivityIndicator color="white" /> : null}
              <Text className="text-sm">Sign Up</Text>
            </Button>
          </View>
        )}
      </KeyboardStickyView>
    </View>
  );
}
