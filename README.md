# pocketrose-assistant-ts

### 版本 3.4.5

1. 团队装备信息中增加威力宝石。
2. 城市主页面显示助手版本信息。

### 版本 3.4.4

1. 打包发布时，lodash和pako使用外部资源。
2. 修复手机极简界面城市收益显示的错误。

### 版本 3.4.3

1. 战斗页面大按钮样式修改，使用原生按钮，字体200%。
2. 团队装备列表排序显示。
3. 团队宠物列表排序显示。
4. 支持本地数据压缩存储，如果内容长度大于阈值（512），则尝试先进行压缩处理。
5. 修改团队面板的按钮布局和样式。
6. 团队宠物提供模拟功能，可以模拟选定宠物满级时的数值。

### 版本 3.4.2

1. 新加团队面板（配置在快速登陆中的称之为团队）。
2. 团队面板中可更新装备和宠物的信息，并提供团队查询功能。
3. 装备包括武器、防具、饰品、宠物蛋和藏宝图，其余忽略。
4. 原宠物图鉴中列出所有宠物的功能删除（移步团队面板）。
5. 口袋助手设置中启用是否自动更新图鉴、宠物、装备。
6. 自动更新图鉴如启用，发生在战数尾数83的时候。
7. 自动更新宠物如启用，发生在战数尾数89的时候。
8. 自动更新装备如启用，发生在战数尾数97的时候。
9. 城市主页面快捷按钮布局修改，新增个、团、险、设。
10. 调整城市主页面快捷按钮布局，调整团队装备、宠物显示格式。

### 版本 3.4.0

1. 重写整个战斗页面处理器逻辑。
2. 不继续在主页触发宠物信息保存（可能会造成读秒误差）。
3. 将触发宠物信息保存的逻辑嵌入到战斗页面的返回按钮逻辑之中。
4. 战斗不再使用回血道具判断战数。

### 版本 3.3.11

1. 宠物图鉴中提供查询自己队伍所有宠物的功能。
2. 宠物信息定期保存，助手设置中配置。
3. 进入宠物图鉴时会自动保存当前账号的宠物信息。
4. 宠物列表中位置P表示身上宠物，C表示笼子中宠物，R表示城堡牧场宠物。
5. 修正3，保存宠物信息修改为手动按钮触发。
6. 确保战斗后宠物更新能在返回前完成。
7. 修正6，在城市面板主页触发保存宠物信息，战斗中不再判断。
8. 手机极简模式下标题栏放大。
9. 手机极简模式下保留在线名单。
10. 手机模式下增加城市收益的显示，仅显示，并且在本国城市下才显示。

### 版本 3.3.5

1. 个人面板初版，能完成日常所需的基本操作。
2. 手机极简面板可设置是否菜单下移。
3. 手机极简模式下所有菜单跟随老年模式放大比例放大。
4. 手机极简模式下拉开菜单之间的距离。
5. 职业管理界面加个当前任务的提醒。
6. 手机极简模式下战斗结果页面也保持极简，只保留最后回合基本信息。

### 版本 3.2.9

1. 可设置是否只允许封印初始宠物。
2. 宠物管理界面增强显示宠物的资料信息，包括其技能和进退化关系。

### 版本 3.2.8

1. 修正宠物排行榜按钮样式在火狐下兼容性问题。
2. 修正饰品屋按钮样式在火狐下兼容性问题。
3. 城市面板支配国情报可配置为是否隐藏。

### 版本 3.2.7

1. 增加了宠物技能字典（从未来馆获取，可能会有不同名字的相同技能，以后随时修正）。
2. 宠物排行榜中可以根据宠物技能查询宠物。
3. 修正宠物图鉴查询的BUG，只查询了快速登陆中的前10个配置。
4. 装备管理界面提供快速找人辅助，需要快速登陆设置配合。
5. 宠物管理界面提供快速找人辅助，需要快速登陆设置配合。
6. 个人状态中可切换分身，并在完成后跳到装备管理。

### 版本 3.2.5

1. 宠物管理界面中献祭处显示完整的宠物进化退化链条。
2. 宠物进化退化关系配置可能有错误，随时修正。
3. 登录页布局可自行设置。

### 版本 3.2.4

1. 宠物管理和资料界面恢复支持宝可梦百科。
2. 宠物管理界面提供封印的功能。
3. 城堡宠物管理界面改造完成。
4. 城市面板布局微调，缩小城市信息页面占比。
5. 城市面板快捷按钮的样式可自行设置。
6. 可以设置城市面板的提交按钮是否使用字母文本，可以避免提交时变形。

### 版本 3.2.3

1. 宠物管理界面升级改造，集成繁殖、进化、退化功能。

### 版本 3.2.2

1. 未满级时单项能力达到极限时更改警示方式，战斗表格背景色标黄警示。
2. 提醒可以转职时更改警示方式，战斗表格背景色标红警示。
3. 手机战斗返回后不在页面顶端，尝试自动触顶。
4. 手机版极简面板（内测）。
5. 修正极简面板倒计时显示错位问题。
6. 老年模式下同比放大倒计时显示。
7. 口袋助手导出配置时忽略图鉴信息。

### 版本 3.1.15

1. 口袋助手设置提供导入、导出、清除功能。
2. 通过以上操作可以在不同的浏览器之前迁移配置信息。
3. 注意：导出功能可能包含账号登陆敏感信息，请自行保证数据安全。

### 版本 3.1.14

1. 更多的宠物排行榜。
2. 宠物图鉴信息可设置定时存储。
3. 进入宠物图鉴时自动存储。
4. 配合快速登陆设置可查询所有账号的图鉴信息。
5. 快速登陆设置最大限制改成50。

### 版本 3.1.12

1. 当口袋服务器返回错误的时候（通常时502），再多给服务器两次机会。

### 版本 3.1.11

1. 城堡管家启用时装备管理可以查看城堡仓库。
2. 城堡管家启用时宠物管理可以查看城堡牧场。
3. 城堡管家入口删除。
4. 装备宠物是否排序可设置。

### 版本 3.1.10

1. 解决Edge浏览器的兼容性显示问题。
2. 城市装备管理重构，增加修理功能。
3. 城堡宠物管理升级改造完成，与牧场联动。
4. 城堡牧场入口删除。

### 版本 3.1.9

1. 城市首页新消息通知丢失问题修复。
2. 城堡装备管理升级改造完成，与仓库联动。
3. 城堡仓库入口删除。

### 版本 3.1.8

1. 城市主页面增加四个快捷按钮。
2. 修正自动砸威力负数不能自动中断的错误。
3. 物品屋升级改造完成。
4. 战斗页面可设置是否使用大按钮。

### 版本 3.1.7

1. 老年版战斗辅助功能，需要设置中启用。
2. 老年版战斗辅助自行选择放大比例。
3. 识别祭奠的状态设置改为账号区分。

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