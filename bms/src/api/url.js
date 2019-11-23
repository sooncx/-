export default {
    // 用户的增删改查
    login: "/api/user/login.json", //登陆

    logout: "/api/user/outLogin.json", //登出

    showUser: "/api/user/showUser.json", //用户展示

    addUser: "/api/user/addUser.json", //添加用户

    updateUser: "/api/user/updateUser.json", //修改用户信息

    delUser: "/api/user/delUser.json", //批量删除用户

    //组织
    upDateOrganization: "/api/organization/upDateOrganization.json", //修改组织信息

    delOrganization: "/api/organization/delOrganization.json", //删除组织信息

    getOrganization: "/api/organization/getOrganization.json", //查找单个组织信息

    addOrganization: "/api/organization/addOrganization.json", //添加组织

    getOTree: "/api/organization/getOTree.json", //组织信息展示

    //设备
    updateVehicle: "/api/vehicle/updateVehicle.json", //修改车辆信息

    delVehicle: "/api/vehicle/delVehicle.json", //删除设备信息

    getVehiclesByOId: "/api/vehicle/getVehiclesByOId.json", // 根据组织获取设备信息

    addVehicle: "/api/vehicle/addVehicle.json", //添加设备信息

    removeVehicle: "/api/vehicle/removeVehicle.json", //车辆转移

    //批量导出
    doWriteExcelUser: "/api/user/doWriteExcelUser.json", //用户批量导出

    writeExcelVehicle: "/api/vehicle/writeExcelVehicle.json", // 设备批量导入

    getVehicleByL: "/api/vehicle/getVehicleByL.json", //模糊查询

    //监控中心
    getVehicleState: "/api/monitoringCenterController/getVehicleState.json", //根据组织展示电池设备状态

    getPosInfo: "/api/monitor/getPosInfo.json", //获取气泡数据（最后位置相关数据）

    getMonitorInfo: "/api/monitor/getMonitorInfo.json", //电池监控信息

    getElectricCurve: "/api/monitor/getElectricCurve.json", // 电流曲线

    //首页
    getAlarms: "api/home/getAlarms.json", //报警加载

    getHomePageInfo: "api/home/getHomePageInfo.json" //首页统计
};