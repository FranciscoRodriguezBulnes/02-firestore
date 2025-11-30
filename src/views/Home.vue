<template>
  <div>
    <h1>Home</h1>
    <p>{{ userStore.userData?.email }}</p>

    <add-form />

    <p v-if="databaseStore.loadingDoc">loading docs...</p>

    <a-space
      style="width: 100%"
      direction="vertical"
      v-if="!databaseStore.loadingDoc"
    >
      <a-card
        v-for="item of databaseStore.documents"
        :key="item.id"
        :title="item.short"
        style="width: 100%"
      >
        <template #extra>
          <a-space>
            <a-popconfirm
              title="¿Estás seguro de elimiar esta URL?"
              ok-text="Sí"
              cancel-text="No"
              @confirm="confirm(item.id)"
              @cancel="cancel"
            >
              <a-button
                danger
                :disabled="databaseStore.loading"
                :loading="databaseStore.loading"
              >
                Eliminar
              </a-button>
            </a-popconfirm>
            <a-button
              type="primary"
              @click="router.push(`/editar/${item.id}`)"
            >
              Editar
            </a-button>
          </a-space>
        </template>
        <p>{{ item.name }}</p>
      </a-card>
    </a-space>
  </div>
</template>

<script setup>
import { useUserStore } from "../stores/user";
import { useDatabaseStore } from "../stores/database";
import { ref } from "vue";
import { useRouter } from "vue-router";
// import AddForm from "../components/AddForm.vue";
import { message } from "ant-design-vue";

const userStore = useUserStore();
const databaseStore = useDatabaseStore();
const router = useRouter();

databaseStore.getUrls();

const url = ref("");

// const handleSubmit = () => {
//   // validaciones de esa url...
//   databaseStore.addUrl(url.value);
// };

const confirm = async (id) => {
  const error = await databaseStore.deleteUrl(id);

  if (!error) {
    return message.success("Eliminado con éxito 😊");
  }
  return message.error(error);
};
const cancel = (e) => {
  console.log(e);
  message.error("Cancelada la eliminación 🤳");
};
</script>
