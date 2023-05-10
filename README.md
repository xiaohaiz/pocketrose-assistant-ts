# pocketrose-assistant-ts

### 版本 3.1.5

1. 在设置中可开启识别是否可祭奠，根据祭奠状态展现不同的按钮样式。

### 版本 3.1.4

1. 饰品店改造升级完成。
2. 自动砸威力时装备附加威力为负数时中断。

### 版本 3.1.3

1. 城市首页安全退出按钮也可以隐藏。
2. 改进宠物资料的显示，增加平均成长的可能最高值。
3. 修正武器店商品重量显示错误的问题。
4. 修正城市翡冷翠的描述说明。
5. 防具屋升级改造完成。

### 版本 3.1.2

1. 调整城市可以直接收益的数值范围。
2. 城堡银行改造升级，可转账。
3. 城市银行改造升级，可转账。
4. 宝石屋升级改造。

### 版本 3.1.0

1. 引入核心的位置状态机，借助本地存储位置信息解决同一页面在不同位置复用的问题。
2. 页面拦截器逻辑层，根据位置状态机的当前状态选择不同的页面处理器。
3. 地图模式个人装备管理页面改造。
4. 领取俸禄后存钱返回，支持城市模式和城堡模式。

### 版本 3.0.13

1. 继续修复，稍微优雅一点，在城市面板/城堡面板/野外面板存Location到本地存储；
2. 拦截装备的时候判断Location如果在野外则跳过使用原版的界面。

### 版本 3.0.11

1. 宠物排行榜漏掉了防御族值字段。
2. 城堡管家仓库装备排序微调。
3. 临时紧急修复野外无法渲染装备界面的问题（原因是在野外无法查看个人状态）。
4. 临时解决方案很不优雅，有些功能无法继续使用，后续再考虑怎么修复。

### 版本 3.0.10

1. 网球馆改造为城堡管家，可以也仅可以查询城堡仓库和牧场的库存，需要设置中启用。

### 版本 3.0.9

1. 感谢饭娃的创意，宠物管理中可以查看宠物的基本族值、努力值、捕获率、成长经验等信息。
2. 宠物资料馆改造成宠物排行榜，可以查看宠物各种TOP30的情况。

### 版本 3.0.8

1. 设置新增可以关闭城市收益的功能（自用）。
2. 宝石屋完成现代化改造，同时提供镶嵌和销毁功能，需要设置中启用。

### 版本 3.0.7

1. 删除装备管理中的收藏按钮，功能有点过于复杂造成代码逻辑不清晰。
2. 城堡牧场完成现代化改造。
3. 武器屋现完成现代化改造，需要在设置中启用超市功能。

### 版本 3.0.6

1. 修复宠物管理的BUG，没有黄金笼子也能执行入笼操作并导致宠物消失。

### 版本 3.0.5

1. 野外简易驿站功能，能移动到地图上任意选定的坐标。
2. 城市主页面收益背景改为更加友好的绿色。
3. 恢复宠物图鉴界面的文本统计信息。
4. 设置项可隐藏城市主页面出城按钮，单击城市图片可恢复显示。

### 版本 3.0.4

1. 本国（非在野）城市收益超过5万后显示样式改变，双击触发收益。
2. 快速登陆功能，设置中启用，然后自行设置登陆账号后在登录页可以快捷登陆。

### 版本 3.0.3

1. 事件屏处理器结构初步完成。
2. 当发生人质失踪事件时，根据密语定位可疑的城市及相关的坐标并显示在事件屏上。
3. 隐藏枫丹的收益。
4. 移动模式的地图中，城市背景色读取城市情报按照不过的所属自动填充。
5. 城堡主页面菜单项调整。
6. 城堡仓库界面使用Ajax重构。

### 版本 3.0.2

1. 城市主页面、地图主页面、城堡主页面、势力图的事件面板重新格式化渲染。
2. 修复部分页面中破掉的宝石图片。
3. 紧急修复：修复当前页面文本的错误读取，之前导致了冒险家公会进入错误和主页面渲染错误。

### 版本 3.0.0

1. 使用TypeScript重写口袋助手，代码结构优化。
2. 口袋助手设置迁移完成。
3. 战斗推荐系统迁移完成。
4. 驿站系统迁移完成，全新的地图移动模式。
5. 冒险家公会迁移完成。
6. 装备管理迁移完成，提供与百宝袋的联动。
7. 宠物管理迁移完成，提供与黄金笼子的联动。
8. 职业管理迁移完成。
9. 修复战斗入手提示的判断错误的BUG，使用了正常战斗的判断条件。
10. 如果有网络请求错误发生的时候，尽可能在消息面板发布错误消息。
11. 设置项：经验是否使用进度条显示。

### 版本 3.0.0.RC2

1. 装备管理界面，单击饭饭头像可以出现祭奠按钮，自动取钱并祭奠选定的装备。
2. 祭奠按钮出现前，会检查祭奠战数是否已经冷却完成。
3. 移除首页的临时按钮。

### 版本 3.0.0.RC1

1. 使用ts重新实现。
2. 助手主要功能迁移完成。
3. 移动界面完全改版，支持地图模式。