<template>
  <h1 class="text-center">Perfil de usuario</h1>
  <!-- Imagen de perfil -->
  <div style="text-align: center; margin-bottom: 20px">
    <img
      :src="userStore.userData?.photoURL"
      alt="Foto de perfil"
      style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover"
    />
  </div>

  <a-avatar>
    <img
      :src="userStore.userData?.photoURL"
      alt="Foto de perfil"
    />  
  </a-avatar>

  <p>{{ userStore.userData }}</p>
  <a-row>
    <a-col
      :xs="{ span: 24 }"
      :sm="{ span: 12, offset: 6 }"
    >
      <a-form
        name="basicPerfil"
        autocomplete="off"
        layout="vertical"
        :model="userStore.userData"
        @finish="onFinish"
      >
        <a-form-item
          name="email"
          label="Introduce tu correo"
          :rules="[
            {
              type: 'email',
              required: true,
              whitespace: true,
              message: 'Tu correo (no modificabe)',
            },
          ]"
        >
          <a-input
            disabled
            v-model:value="userStore.userData.email"
          ></a-input>
        </a-form-item>
        <a-form-item
          name="displayName"
          label="Introduce tu nickName"
          :rules="[
            {
              required: true,
              whitespace: true,
              message: 'Por favor, introduce un nickName correcto!',
            },
          ]"
        >
          <a-input v-model:value="userStore.userData.displayName"></a-input>
        </a-form-item>

        <!-- :max-count="1"  -->
        <a-upload
          v-model:fileList="fileList"
          list-type="picture"
          :file-list="fileList"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <a-button>Subir foto de perfil</a-button>
        </a-upload>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :disabled="userStore.loadingUser"
            :loading="userStore.loadingUser"
            >Actulaizar información</a-button
          >
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<script setup>
import { useUserStore } from "@/stores/user";
import { message } from "ant-design-vue";
import { ref } from "vue";

const userStore = useUserStore();
const fileList = ref([]);

const beforeUpload = (file) => {
  fileList.value = [...fileList.value, file];
  return false; // Evita la subida automática
};

const handleRemove = (file) => {
  const index = fileList.value.indexOf(file);
  const newFileList = fileList.value.slice();
  newFileList.splice(index, 1);
  fileList.value = newFileList;
};

const handleChange = (info) => {
  // Validar los tipos de imagen
  if (info.file.status !== "uploading") {
    console.log(info.file, info.fileList);
    const isJpgOrPng =
      info.file.type === "image/jpeg" || info.file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Solo puedes subir archivos JPG/PNG!");
      handleRemove(info.file);
      return;
    }
    const isLt2M = info.file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("La imagen debe ser menor de 2MB!");
      handleRemove(info.file);
      return;
    }
  }

  // Valida qu sólo sea una imagen, esto ya está arreglado con :max-count="1"
  let resFileList = [...info.fileList];

  // 1. Limit the number of uploaded files
  //    Only to show two recent uploaded files, and old ones will be replaced by the new
  resFileList = resFileList.slice(-1);

  // 2. read from response and show file link
  resFileList = resFileList.map((file) => {
    if (file.response) {
      // Component will show file.url as link
      file.url = file.response.url;
    }
    return file;
  });
  fileList.value = resFileList;
};

const onFinish = async (value) => {
  // console.log(fileList.value[0]);
  const error = await userStore.updateUser(value.displayName);

  // fileList.value.forEach((file) => {
  //   console.log(file);
  //   // formData.append('files[]', file);
  // });
  if (fileList.value[0]) {
    const errorImg = await userStore.updateImg(fileList.value[0]);
    if (errorImg) {
      return message.error("Error al subir la imagen 😒");
    } else {
      message.success("Imagen de perfil actualizada ✔");
    }   
  }

  if (!error) {
    return message.success("Perfil actualizado correctamente ✔");
  }
  switch (error) {
    case "auth/user-not-found":
      message.error("No exite el usuario 🤷‍♀️");
      break;
    case "auth/invalid-display-name":
      message.error("Nombre de usuario no válido 🤦‍♀️");
      break;
    default:
      message.error("Otro tipo de error en el servidor 😒");
      break;
  }
};
</script>
