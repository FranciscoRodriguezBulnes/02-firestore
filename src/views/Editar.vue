<template>
  <div>
    <h1>Editar id: {{route.params.id}}</h1>
    <!-- <form @submit.prevent="handleSubmit">
      <input
        type="text"
        placeholder="Ingrese URL"
        v-model="url"
      />
      <button type="submit">Editar</button>
    </form> -->
    
    <a-form
    name="editform"
    autocomplete="off"
    layout="vertical"
    :model="formState"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
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
        >Editar URL</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useDatabaseStore } from "../stores/database";
import { regExpUrl } from "@/utils/regExpUrl";
import { message } from 'ant-design-vue';

const databaseStore = useDatabaseStore();

const route = useRoute();
const formState = reactive({
  url: "",
});

// console.log(route.params.id)

// const handleSubmit = () => {
//   // validaciones de el input
//   databaseStore.updateUrl(route.params.id, url.value);
// };

const onFinish = async (values) => {
  console.log("todo correcto " + values);
  const error = await databaseStore.updateUrl(route.params.id, formState.url);

  if (!error) {
    formState.url = "";
    return message.success("URL modificada satisfactoriamente ✔");
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






// const url = ref('')

onMounted(async () => {
  formState.url = await databaseStore.leerUrl(route.params.id);
});
</script>
