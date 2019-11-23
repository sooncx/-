import url from "./url";
import { GET, POST, exportFile } from "./apiFn";

export default {
    // 用户的增删改查
    /**
@method login
@param {password，username} 参数名:{}
@description
*/
    login: params => GET(url.login, params), // 登陆

    /**
     @method logout
     @param {} 参数名:{}
     @description
    */
    logout: params => POST(url.logout, params), // 登出

    /**
     @method showUser
     @param {} 参数名:{}
     @description
    */
    showUser: params => GET(url.showUser, params), // 用户展示

    /**
     @method addUser
     @param {} 参数名:{}
     @description
    */
    addUser: params => GET(url.addUser, params), // 添加用户

    /**
     @method updateUser
     @param {} 参数名:{}
     @description
    */
    updateUser: params => POST(url.updateUser, params), // 修改用户信息

    /**
     @method delUser
     @param {} 参数名:{}
     @description
    */
    delUser: params => POST(url.delUser, params), // 修改用户信息

    //组织
    /**
     @method upDateOrganization
     @param {} 参数名:{}
     @description
    */
    upDateOrganization: params => POST(url.upDateOrganization, params), // 修改组织信息

    /**
     @method delOrganization
     @param {} 参数名:{}
     @description
    */
    delOrganization: params => POST(url.delOrganization, params), // 删除组织信息

    /**
     @method getOrganization
     @param {} 参数名:{}
     @description
    */
    getOrganization: params => GET(url.getOrganization, params), // 查找单个组织信息

    /**
     @method addOrganization
     @param {} 参数名:{}
     @description
    */
    addOrganization: params => POST(url.addOrganization, params), // 添加组织

    /**
     @method getOTree
     @param {} 参数名:{}
     @description
    */
    getOTree: params => GET(url.getOTree, params), // 组织信息展示

    //设备
    /**
     @method updateVehicle
     @param {} 参数名:{}
     @description
    */
    updateVehicle: params => POST(url.updateVehicle, params), // 修改车辆信息

    /**
     @method delVehicle
     @param {} 参数名:{}
     @description
    */
    delVehicle: params => POST(url.delVehicle, params), // 删除设备信息

    /**
     @method getVehiclesByOId
     @param {} 参数名:{}
     @description
    */
    getVehiclesByOId: params => GET(url.getVehiclesByOId, params), // 根据组织获取设备信息

    /**
     @method addVehicle
     @param {} 参数名:{}
     @description
    */
    addVehicle: params => POST(url.addVehicle, params), // 添加设备信息

    /**
     @method removeVehicle
     @param {} 参数名:{}
     @description
    */
    removeVehicle: params => POST(url.removeVehicle, params), // 车辆转移

    //批量导出
    /**
     @method doWriteExcelUser
     @param {} 参数名:{}
     @description
    */
    doWriteExcelUser: params => exportFile(url.doWriteExcelUser, params), // 用户批量导出

    /**
     @method writeExcelVehicle
     @param {} 参数名:{}
     @description
    */
    writeExcelVehicle: params => exportFile(url.writeExcelVehicle, params), // 设备批量导入

    /**
     @method getVehicleByL
     @param {} 参数名:{}
     @description
    */
    getVehicleByL: params => GET(url.getVehicleByL, params), // 设备批量导入

    //监控中心

    /**
      @method getVehicleState
      @param {} 参数名:{}
      @description
    */
    getVehicleState: params => GET(url.getVehicleState, params), // 设备批量导入 

    /**
    @method getPosInfo
    @param {} 参数名:{}
    @description
    */
    getPosInfo: params => GET(url.getPosInfo, params), // 获取气泡数据（最后位置相关数据） 

    /**
    @method getMonitorInfo
    @param {} 参数名:{}
    @description
    */
    getMonitorInfo: params => GET(url.getMonitorInfo, params), // 电池监控信息

    /**
    @method getElectricCurve
    @param {} 参数名:{}
    @description
    */
    getElectricCurve: params => GET(url.getElectricCurve, params), // 电池监控信息

    /**
    @method getAlarms
    @param {} 参数名:{}
    @description
    */
    getAlarms: params => GET(url.getAlarms, params), // 报警加载

    /**
    @method getHomePageInfo
    @param {} 参数名:{}
    @description
    */
    getHomePageInfo: params => GET(url.getHomePageInfo, params), // 首页统计
};