<template>
  <!--<div>-->
    <!--<el-row >-->
      <!--<el-col :offset="2" :span="8">-->
        <!--<el-input :id="suggestId" v-model="address_detail" :clearable='clearable' placeholder="请输入店铺地址,获取店铺坐标" >-->
        <!--</el-input>-->
      <!--</el-col>-->
      <!--<el-col :span="2">-->
        <!--<el-button id="position" @click="search" type="primary">定位</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="2">-->
        <!--<el-button type="primary" @click="address">定位2</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="12" >-->
        <!--<el-tag type="success">经度 {{userlocation.lng}}</el-tag>-->
        <!--<el-tag type="success">纬度 {{userlocation.lat}}</el-tag>-->
        <!--<el-tag type="success" >点击左侧按钮复制经纬度信息</el-tag>-->
      <!--</el-col>-->
    <!--</el-row>-->
    <!--<el-row>-->
      <!--<el-col :offset="2" :span="18">-->
        <!--<div id="map_canvas" class="allmap" ></div>-->
      <!--</el-col>-->
    <!--</el-row>-->
  <!--</div>-->
  <div>
  <el-input v-model="address_detail"></el-input>
    <el-col :span="2">
      <el-button @click="addre">定位</el-button>
    </el-col>
    <el-col :span="18">
      <div id="allmap"></div>
    </el-col>
  </div>
</template>
<script>
import BMap from 'BMap'
export default {
  data () {
    return {
      address_detail: '', // 详细地址
      userlocation: { lng: '', lat: '' },
      clearable: true,
      suggestId: 'suggestId',
      map: {},
      mk: {}
    }
  },
  created () {

  },
  mounted () {
    this.$nextTick(function () {
      // this.drawMap()
      // this.addre()
    })
  },
  methods: {
    drawMap () {
      let _this = this
      _this.map = new BMap.Map('map_canvas') // 创建地图实例
      _this.map.addControl(new BMap.NavigationControl()) // 启用放大缩小 尺
      _this.map.enableScrollWheelZoom()
      _this.getlocation()// 获取当前坐标, 测试时获取定位不准。
      let point = new BMap.Point(_this.userlocation.lng, _this.userlocation.lat) // 创建点坐标
      console.log(point)
      _this.map.centerAndZoom(point, 13) // 初始化地图，设置中心点坐标和地图级别
      let marker = new BMap.Marker(point) // 创建标注
      _this.map.addOverlay(marker) // 将标注添加到地图中
      let ac = new BMap.Autocomplete({
        // 建立一个自动完成的对象
        input: 'suggestId',
        location: this.map
      })
      let myValue
      ac.addEventListener('onconfirm', (e) => {
        // 鼠标点击下拉列表后的事件
        let _value = e.item.value
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business
        _this.address_detail = myValue
        _this.setPlace()
      })
    },
    address () {
      var map = new BMap.Map('allmap')
      var point = new BMap.Point(116.331398, 39.897445)
      map.centerAndZoom(point, 12)

      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() === BMAP_STATUS_SUCCESS) {
          var mk = new BMap.Marker(r.point)
          map.addOverlay(mk)
          map.panTo(r.point)
          console.log('您的位置：' + r.point.lng + ',' + r.point.lat)
          console.log(r)
        } else {
          alert('failed' + this.getStatus())
        }
      }, {enableHighAccuracy: true})
      // var map = new BMap.Map('allmap')
      // var point = new BMap.Point(116.331398, 39.897445)
      // map.centerAndZoom(point, 12)
      //
      // function myFun (result) {
      //   var cityName = result.name
      //   map.setCenter(cityName)
      //   console.log(result)
      //   console.log('当前定位城市:' + cityName)
      // }
      // var myCity = new BMap.LocalCity()
      // myCity.get(myFun)
    },
    getMarker (point) {
      this.mk = new BMap.Marker(point)
      this.mk.addEventListener('dragend', this.showInfo)
      this.mk.enableDragging() // 可拖拽
      this.getAddress(point)
      this.map.addOverlay(this.mk)// 把点添加到地图上
      this.map.panTo(point)
    },
    getlocation () {
      // let BMAP_STATUS_SUCCESS = ''
      // 获取当前位置
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition((r) => {
        let _this = this
        console.log(r)
        if (geolocation.getStatus() === BMAP_STATUS_SUCCESS) {
          _this.getMarker(r.point)
          _this.userlocation = r.point
        } else {
          alert('failed' + _this.getStatus())
        }
      })
    },
    // 绑定Marker的拖拽事件
    showInfo (e) {
      var gc = new BMap.Geocoder()
      gc.getLocation(e.point, (rs) => {
        var addComp = rs.addressComponents
        var address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber// 获取地址

        // 画图 ---》显示地址信息
        var label = new BMap.Label(address, {offset: new BMap.Size(20, -10)})
        this.map.removeOverlay(this.mk.getLabel())// 删除之前的label

        this.mk.setLabel(label)
        this.address_detail = address
        this.userlocation = e.point
      })
    },
    // 获取地址信息，设置地址label
    getAddress (point) {
      var gc = new BMap.Geocoder()

      gc.getLocation(point, (rs) => {
        var addComp = rs.addressComponents
        var address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber// 获取地址

        // 画图 ---》显示地址信息
        var label = new BMap.Label(address, {offset: new BMap.Size(20, -10)})
        this.map.removeOverlay(this.mk.getLabel())// 删除之前的label
        this.address_detail = address
        this.mk.setLabel(label)
      })
    },
    setPlace () {
      this.map.clearOverlays() // 清除地图上所有覆盖物
      var th = this
      function myFun () {
        th.userlocation = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
        th.map.centerAndZoom(th.userlocation, 18)
        th.getMarker(th.userlocation)
      }

      var local = new BMap.LocalSearch(this.map, {
        onSearchComplete: myFun // 智能搜索
      })
      local.search(this.address_detail)
    },
    search () {
      var localSearch = new BMap.LocalSearch(this.map)
      localSearch.enableAutoViewport() // 允许自动调节窗体大小
      this.searchByInputName(localSearch)
    },
    searchByInputName (localSearch) {
      this.map.clearOverlays() // 清空原来的标注
      var th = this
      var keyword = this.address_detail
      localSearch.setSearchCompleteCallback(function (searchResult) {
        var poi = searchResult.getPoi(0)
        th.userlocation = poi.point
        th.map.centerAndZoom(poi.point, 13)
        th.getMarker(th.userlocation)
      })
      localSearch.search(keyword)
    },
    address () {
      let _this = this
      _this.drawMap()
    }
  }

}
</script>
<style scoped>
  .allmap {
    width: 100%;
    height: 400px;
    font-family: "微软雅黑";
    border: 1px solid green;
  }
  .el-tag {
    cursor: pointer;
  }
</style>
