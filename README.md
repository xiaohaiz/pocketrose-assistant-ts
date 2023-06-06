# pocketrose-assistant-ts

### 版本 3.7.8-SNAPSHOT

1. 修正十二宫统计报告中出率的计算公式。

### 版本 3.7.7

1. 手机版战斗模式宠物升级也修改战斗记录面板的背景色为麦色。
2. 战斗结果中新增常见上洞入手、藏宝图、宝石的数量存储。
3. 团队统计先简单支持入手的总数。
4. 上洞入手明细统计，包括入手率及占比。
5. 宝石入手明细统计，包括入手率及占比。
6. 十二宫战斗分析报告。
7. 战斗统计报告新的样式，包含战数、图鉴、宠物等信息。
8. 团队统计 -> 统计报告。
9. 在城堡界面也可以查看统计报告。
10. 战斗统计增加上洞入手统计。
11. 战斗统计增加藏宝图入手统计。
12. 怪物统计报告，查看最吸引你的怪物是什么。
13. 四天王统计报告，看看四天王最爱见谁。
14. 怪物统计报告同时提供战数和胜率的排行。
15. 十二宫统计报告改版。

### 版本 3.7.0

1. 战斗模式宠物升级时背景色显示为麦色。
2. 战斗结果存储增加捕获数和图鉴数。
3. 修正怪物位置信息中“上冻”为“上洞”。
4. 皇宫任务存储数据从LocalStorage迁移到IndexedDB。
5. 目前皇宫任务只支持杀怪任务。
6. 原有的位置狀態機刪除，改爲角色狀態機。
7. 狀態機的存儲機制從LocalStorage遷移到IndexedDB。
8. 因爲大尺寸數據已經遷移到IndexedDB，因此不再繼續使用pako壓縮解壓機制。
9. 記錄團隊中最後一個登陸隊員的存儲從LocalStorage遷移到IndexedDB。
10. 至此數據分離已經完成，配置數據使用LocalStorage，動態數據使用IndexedDB。
11. 团队统计包括图鉴的出率和宠物的出率。

### 版本 3.6.7

1. 战斗处理器结构优化。
2. 修复战斗模式皇宫任务更新的缺失。
3. 将战斗记录的存储从LocalStorage迁移到IndexedDB。
4. 存储每次战斗的结果数据，包括对手及胜负情况。
5. 将宠物图鉴的存储从LocalStorage迁移到IndexedDB（需要更新数据后可查询）。
6. 将宠物状态的存储从LocalStorage迁移到IndexedDB（需要更新数据后可查询）。
7. 将装备状态的存储从LocalStorage迁移到IndexedDB（需要更新数据后可查询）。
8. 简单的战斗统计初版实现。
9. 团队统计复用之前“点名”的页面，也可以在扩展按钮配置。
10. 增加怪物胜率排行（胜率最低的前30）。
11. 校正宠物分布场所的名字的错误。
12. 增加四天王占比的统计。
13. 增加转职数据的统计。

### 版本 3.5.20

1. 驿站进入移动模式后隐藏出城按钮。
2. 战斗报告中如果宠物升级，单独渲染出来提醒玩家的注意。
3. 主要需要关注的是宠物学会新技能的那一次升级。
4. 套装可自定义别名，在装备管理界面可按照别名换装。
5. 手机版战斗布局（内测版）。
6. 放大宠物学习技能的提醒。
7. 战斗模式展现入手。
8. 宠物学习技能放大提醒取消。
9. 战斗模式主页增加小彩蛋，可以快速查看一次当前装备和宠物的状态。

### 版本 3.5.16

1. 修改战斗页面解析时定位的方式，以便兼容一些特殊格式的战斗页面。
2. 祭奠提醒是稍微放大字体到120%。
3. 城市快捷收益改为异步模式，完成后直接返回首页。
4. 安全战斗按钮采取更激进的隐藏方式，不能接受的别启用此设置。
5. 修复快捷按钮使用默认按钮样式无法显示的问题。
6. 城市主按钮支持自定义样式。
7. 增加一种更符合口袋配色的按钮样式。
8. 战斗模式增加对手的名字和战斗结果的信息。
9. 战斗模式增加自己宠物的信息。
10. 战斗模式默认开启极速战斗。
11. 战斗模式报告增加简单的渲染动画，需设置，单号玩家可以开启。

### 版本 3.5.9

1. 战斗布局（体验版），未来不一定会继续细化。
2. 修正毒臭釉434宠物名字的错误。
3. 战斗布局细节调整，显示战斗场所和战斗对象。
4. 新增“养精蓄锐”扩展按钮，完全恢复体力。
5. FATAL: 处理战斗布局选错验证码的提示。
6. 可配置安全战斗按钮功能，读秒完成前战斗按钮被禁用。
7. 可能带来稍微的读秒损耗，目的在于避免不必要的验证码损失。
8. 修复手机极简布局B无法收益的问题。
9. 城市面板缺省按钮样式修改。
10. 补齐战斗布局中缺失的战斗报告。

### 版本 3.5.3

1. 恢复彩蛋功能，城市收益栏目底色变绿时可直接点击收益。
2. 扩展按钮可以选择城市收益之外的其他功能。
3. 聊天布局启用消息自动刷新（间隔5秒一次）。
4. 聊天刷新因为会额外请求服务器，强烈建议只为主号选择此布局。
5. 修正城市收益判断条件的缺失。
6. 聊天布局时可设置刷新频率，也可关闭。

### 版本 3.5.1

1. 面板布局增加专属设置，优先级高于全局设置。
2. 新增面板聊天布局。
3. 调整手机极简布局的细节。

### 版本 3.5.0

1. 整个城市面板逻辑和结构重构。
2. 取消了城市收益的彩蛋功能，可以配置扩展按钮行为“城市收益”来代替。
3. 在城市驿站中增加了出城的按钮，如果隐藏出城按钮可通过城市驿站来完成。
4. 取消了手机极简模式的相关设置。
5. 增加了新的设置“城市面板的布局”，手机用户请选择“手机极简布局A/B”。

### 版本 3.4.23

1. 仕官界面支持秦汉二十等爵显示。
2. 宠物管理界面增加与同类顶级能力差距的百分比显示。

### 版本 3.4.21

1. 野外地图模式装备管理支持一键换装。
2. 地铁迪士尼乐园装备管理支持一键换装。
3. 战斗页面宠物技能变化栏目字体用蓝色表示。
4. 可设置战斗报告是否紧凑格式显示。

### 版本 3.4.16

1. 团队宠物列表种模拟功能可以评估出当前宠物距离同类顶级宠物的能力差距。
2. 团队宠物列表中的满级宠物也可以评估（改名的宠物忽略无视）。
3. 宠物排行中可以查询指定编号的宠物详细资料。
4. 宠物排行可以配置是否使用快捷按钮。

### 版本 3.4.15

1. 团队人多的时候经常在快速登陆页面忘记应该到谁了。
2. 记录快速登陆最后一次登陆的队员，将其名字标红便于定位。
3. 国家动员指令和在野招募告示无法发布中文的问题修复。
4. 快捷按钮启用前提下，可以自定义扩展快捷按钮，在设置中选择。

### 版本 3.4.13

1. 使用手册中添加任务指南。
2. 全新版皇宫任务，需要在设置中启用。
3. 目前只支持杀怪任务状态显示。

### 版本 3.4.12

1. 简易任务指南完成。
2. 在城市可进入任务屋获取任务指南（冒险家公会上面第二个）。
3. 获取相应的任务指南后，进入地图模式会有任务辅助信息出现。
4. 地图上黄色坐标表示任务地点。
5. 地图右边信息栏显示任务的攻略。
6. 完成任务后切记回城取消任务指南。

### 版本 3.4.11

1. 地铁区域迪士尼乐园支持新版装备管理界面。
2. 地铁区域迪士尼乐园地图模式启用。
3. 齐心丹任务攻略辅助，感谢末末倾情提供。

### 版本 3.4.10

1. 修复国民一览中破掉的链接。
2. 身份系统可配置秦汉二十等爵位（部分页面完成）。
3. 区别处理在野主页面页面布局显示格式不同的问题。
4. 城市面板和地图面板动员指令位置不一致，区别对待。

### 版本 3.4.7

1. 百宝袋和黄金笼子显示增加容量信息。
2. 为了躲避骷髅兔子的打劫，领取俸禄转移到口袋银行。
3. 首页冒险快捷按钮切换到银行，便于领取俸禄。
4. 口袋助手使用手册v1正式上线（感谢豚豚的辛勤付出）。

### 版本 3.4.6

1. 野外面板整合地图移动模式。
2. 删除野外简易驿站功能。

### 版本 3.4.5

1. 团队装备信息中增加威力宝石。
2. 城市主页面显示助手版本信息。
3. 口袋助手使用手册基础结构。

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