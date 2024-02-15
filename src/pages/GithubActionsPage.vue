<script setup lang="ts" xmlns="http://www.w3.org/1999/html">

import {onMounted, ref, watchEffect} from "vue";
import {useRoute} from 'vue-router';
import GithubActionsWorkflow from "@/components/GithubActionsWorkflow.vue";

const route = useRoute()
// ----------------------------------------------------------------------------

const githubClientId = ref('6b8d0712726b3f85ab24')
const workflowId = ref("123")

onMounted(async () => {
   // TODO
})

</script>

<template>
    <v-container style="width: 100%; max-width: 440px">
        <p>
          <a :href="`https://github.com/login/oauth/authorize?scope=user:email&client_id=${githubClientId}`">Login</a>
        </p>
        <v-card class="mx-auto">
            <v-container>
                <github-actions-workflow
                    :workflowId="workflowId"
                />
            </v-container>
        </v-card>
    </v-container>
</template>

<style>

</style>
