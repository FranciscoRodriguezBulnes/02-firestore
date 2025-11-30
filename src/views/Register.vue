<template>
  <h1 class="text-center">Register</h1>
  <a-row>
    <a-col
      span="12"
      offset="6"
    >
      <a-form
        name="basicLogin"
        autocomplete="off"
        layout="vertical"
        :model="formState"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          name="email"
          label="Introduce tu correo"
          :rules="[
            {
              type: 'email',
              required: true,
              whitespace: true,
              message: 'Por favor, introduce un correo correcto!',
            },
          ]"
        >
          <a-input v-model:value="formState.email"></a-input>
        </a-form-item>

        <a-form-item
          name="password"
          label="Introduce tu contraseña"
          :rules="[
            {
              required: true,
              min: 6,
              whitespace: true,
              message:
                'Por favor, introduce tu contraseña con un mínimo de 6 caracteres',
            },
          ]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item
          name="repassword"
          label="Repite la contraseña"
          :rules="[
            {
              required: true,
              // min: 6,
              // whitespace: true,
              validator: validatePass,
            },
          ]"
        >
          <a-input-password v-model:value="formState.repassword" />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :disabled="userStore.loadingUser"
            :loading="userStore.loadingUser"
            >Registrar</a-button
          >
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useUserStore } from "../stores/user";
import { message } from 'ant-design-vue';


const userStore = useUserStore();

const formState = reactive({
  email: "frbacsa@gmail.com",
  password: "jacobo1!",
  repassword: "jacobo1!",
});

// const email = ref("");
// const password = ref("");

// const handleSubmit = async () => {
//   // if (!email.value || password.value.length <script 6) {
//   //   return alert("llena los campos");
//   // }

// };

const validatePass = async (_rule, value) => {
  if (value === "") {
    return Promise.reject("Por favor, repite la contraseña");
  } else {
    if (value !== formState.password) {
      return Promise.reject("No coinciden las contraseñas");
    }
    return Promise.resolve();
  }
};

const onFinish = async (values) => {
  console.log("Success:", values);
  const error = await userStore.registerUser(
    formState.email,
    formState.password
  );

  if (!error) {
    return message.success("Usuario registrado con éxito 😃");
  }

  switch (error) {
    case "auth/email-already-in-use":
      // alert("No existe esa cuenta");
      message.error("Ya exite ese correo 🤷‍♀️");
      break;
    case "auth/invalid-login-credentials":
      message.error("Error de credenciales 🤦‍♀️");
      // alert("auth/invalid-login-credentials");
      break;
    default:
      message.error("Otro tipo de error 😒");
      // alert("algo ha fallado distinto a No exite la cuenta");
      break;
  }
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
</script>
