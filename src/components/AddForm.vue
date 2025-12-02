<script setup>
import { reactive } from "vue";
import { regExpUrl } from "../utils/regExpUrl";

import { useUserStore } from "@/stores/user";
import { useDatabaseStore } from "@/stores/database";
import { message } from "ant-design-vue";

const userStore = useUserStore();
const databaseStore = useDatabaseStore();

const formState = reactive({
  url: "",
});

const onFinish = async (values) => {
  console.log("todo correcto " + values);
  const error = await databaseStore.addUrl(values.url);

  if (!error) {
    formState.url = "";
    return message.success("URL añadida satisfactoriamente ✔");
  }

  switch (error) {
    // buscar errores de firestore, los que aparecen no se corresponden con lo que puede salir
    case "auth/user-not-found":
      // alert("No existe esa cuenta");
      message.error("No exite el correo registrado 🤷‍♀️");
      break;
    case "auth/invalid-login-credentials":
      message.error("Error de credenciales 🤦‍♀️");
      // alert("auth/invalid-login-credentials");
      break;
    default:
      message.error("Otro tipo de error en el servidor 😒");
      // alert("algo ha fallado distinto a No exite la cuenta");
      break;
  }
};
</script>

<template>
  <a-form
    name="addform"
    autocomplete="off"
    layout="vertical"
    :model="formState"
    @finish="onFinish"
  >
    <a-form-item
      name="url"
      label="Introduce una URL"
      :rules="[
        {
          pattern: regExpUrl,
          required: true,
          whitespace: true,
          message: 'Por favor, introduce una URL válida',
        },
      ]"
    >
      <a-input v-model:value="formState.url"></a-input>
    </a-form-item>

    <a-form-item>
      <a-button
        type="primary"
        html-type="submit"
        :disabled="databaseStore.loading"
        :loading="databaseStore.loading"
        >Agregar URL</a-button
      >
    </a-form-item>
  </a-form>
</template>
