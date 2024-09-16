## Form + hookform ✨

Check out NativewindUI here: https://nativewindui.com/

---

## Demo

### iOS

https://github.com/user-attachments/assets/fb423e04-c9c1-4b59-85cf-ff73f05495d7

### Android

https://github.com/user-attachments/assets/a14317f9-2c62-4242-a32a-e55375154cd3

## Usage

1. Form setup:
   ```typescript
   const form = useForm<SignupFormValues>({
     resolver: zodResolver(SignupSchema),
     defaultValues: { ... }
   });
   ```
   This initializes the form with Zod schema validation and default values.

2. Form wrapper:
   ```tsx
   <Form form={form} className="gap-2">
     {/* Form sections and fields */}
   </Form>
   ```
   The `Form` component wraps all form elements and receives the `form` object from react-hook-form.

3. Form sections:
   ```tsx
   <FormSection
     className="ios:bg-background"
     ios={{ title: "Personal Information" }}
     fields={pickFields(form, ["firstName", "lastName"])}
   >
     {/* Form items */}
   </FormSection>
   ```
   Each `FormSection` groups related fields. The `fields` prop, populated using `pickFields`, specifies which form fields belong to this section. This allows the section to display relevant errors for its fields.

4. Form fields:
   ```tsx
   <FormItem>
     <FormTextField
       name="firstName"
       placeholder="First Name" // For iOS
       label="First Name" // For Android
       returnKeyType="next" // Automatically focuses on the next input element
     />
   </FormItem>
   ```
   `FormTextField` components are used for text inputs. They automatically connect to react-hook-form using the `name` prop.

5. Custom fields:
   ```tsx
   <Controller
     control={form.control}
     name="brithday"
     render={({ field: { value, onChange } }) => (
       <FormItem>
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
   ```
   For custom inputs like `DatePicker`, the `Controller` component from react-hook-form is used to integrate them with the form state.

6. Form submission:
   ```tsx
   const onSubmit = async (data: SignupFormValues) => {
     // Handle form submission
   };

   <Button onPress={handleSubmit(onSubmit)}>
     <Text>Sign Up</Text>
   </Button>
   ```
   The `handleSubmit` function from react-hook-form is used to process the form data on submission.

This setup allows for a clean separation of form logic and UI components while providing automatic error handling and validation.

