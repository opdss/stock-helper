<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center">
        <!--
        <img alt="Quasar logo" src="~assets/icon-128x128.png" />
        -->
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import * as utils from "src/libraries/utils";
import * as service from "src/libraries/service";
import _ from "lodash";
export default {
  name: "Test",
  mounted() {
    service.searchStock("1").then((res) => {
      let d1 = utils.parseSearchData(res.data);
      let d2 = utils.parseSearchData(res.data, true);
      console.log(d1);
      console.log(d2);
      console.log(d1.map((d) => d.exCode));
      console.log(_.keys(d2));
      utils.getStocksInfo(_.keys(d2), true).then((res) => {
        console.log(res);
      });
    });
  },
};
</script>
