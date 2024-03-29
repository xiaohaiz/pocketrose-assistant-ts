# pocketrose-assistant-ts

### 版本 4.5.9

1. 装备管理界面修理操作交互体验改进。
2. 个人面板页面定型分身特殊显示，部分黑底白字。
3. 个人状态页面定型分身特殊显示，部分黑底白字。

### 版本 4.5.8

1. 城市装备管理中提供“闲置装备入袋”的功能。
2. 宝石镶嵌页面增加简单的宝石序号显示，方便一目了然知道宝石的数量（没分类，麻烦）。
3. 宝石镶嵌记录数据存储数据结构中增加装备名称的字段。
4. 威力统计报告从团队面板移动到统计面板。
5. 设置项“全局战斗场偏好”更改为单选设置，可重置取消。
6. 口袋助手接管分身试管页面。
7. 新增设置项：自行确认分身的定型情况。已经定型的分身不提示转职，并且关闭转职入口。
8. 原有的转职入口设置开关删除。
9. BUGFIX: 修复统计中无法导出战斗日志的BUG。
10. BUGFIX: 修复装备管理中给队友发送宝石时没有正确判断接收人是否选择的问题。
11. 核心处理器结构重构：STATELESS => STATEFUL

### 版本 4.5.6

1. 新增“自动转移城据点”设置，仅限使用驿站移动到其他城市的场景。
2. 城市装备管理中可启动“自动卖掉身上的龙珠”。
3. 城市装备管理中提供快速为队友发送宝石的功能。
4. 助手设置页面点击设置项的名字栏自行置顶或取消置顶。

### 版本 4.5.5

1. 简化，删除设置项“十二宫宠物亲密”，默认开启。
2. 设置项“智能战斗切换点”显示格式改进。
3. 设置项“隐藏快捷键提示”显示格式错误修正。
4. 简化，删除设置项“战斗入手的提示”。
5. 简化，删除设置项“正常战斗的提示”。
6. 口袋助手设置界面改进，所有设置项分类别显示，目前分为置顶、界面、战斗、其他。
7. 简化，自定义套装相关代码和显示优化。
8. 城堡功能“自动扫描身上宝石并入库”，进入城堡装备管理，点亮按钮，3秒一次自动扫描身上宝石并入库。
9. 城堡功能“自动扫描身上宠物并放牧”，进入城堡宠物管理，点亮按钮，3秒一次自动扫描身上宠物并放牧。
10. 设置启用宝石控的角色进入城市装备管理时，可看到当前的宝石库存情况。
11. 城堡团队内快速传输（装备、宠物）功能支持。
    1. 本来不想废话了，但是还是简单说明几句吧。
    2. 自用的功能，本意是为了换城堡坐标。
    3. 能自动将身上的宝石传输给选择的队友。
    4. 能自动将身上的宠物传输给选择的队友。
    5. 配合接受者的自动入库功能使用。
    6. 具体操作步骤不赘述了。

### 版本 4.5.3

1. 宝石镶嵌的快捷键由f改到y，尽量避免与浏览器快捷键的冲突。
2. 战斗布局专属新功能：设置是否展示团队的宝石数量。
3. 宝石数量来源于定期的统计数据，非实时，非100%精准。
4. 可以指定团队其中一人展示宝石库存即可，采用基于本地存储的定时器刷新机制。

### 版本 4.5.0

1. 全新的宠物十二宫战斗伴侣功能。
2. 可以在宠物管理页面将身上或者笼子中的任何一个满级宠物设置为十二宫战斗伴侣。
3. 被选为十二宫战斗伴侣的宠物将会特殊格式显示（部分位置黑底白字）。
4. 设置中心中仅能取消战斗伴侣设置。
5. 设置后，宠物管理页面中新增“十二宫战斗伴侣”按钮能快速自动从笼子中取出并装备，快捷键z。
6. 宠物管理提供跳转到宝石镶嵌的按钮，快捷键f。
7. 宝石镶嵌提供跳转到装备管理的按钮，快捷键e。

### 版本 4.4.4

1. 性能提升修复版本，宠物、装备管理退出速度加快，并不会触发读秒。
2. 统计相关的触发器（非实时需求）不再与正常操作关联（可能会错误的导致重新读秒）。
3. 宠物管理中新增更新宠物统计数据的按钮，人工自行操作。
4. 装备管理中新增更新装备统计数据的按钮，人工自行操作。
5. 宠物、装备管理中红色按钮表示会导致重新读秒。

### 版本 4.4.3

1. 先发个周末福利，宠物位和装备位增加空位警告标志。
2. 宠物位满时，主页面城市设施菜单选项所在单元格显示红色背景色。
3. 装备位满时（身上装备>=19件），显示黄色背景色。
4. 宠物和装备同时满时，显示橙色背景色。
5. 完全重构触发器的代码结构，并重新定义触发器的行为，目前提供的说明如下：
   1. 银行账号数据更新触发器
      1. 战斗定期触发，战数尾数：73
      2. 秘宝之岛战斗后触发
      3. 退出银行时触发
   2. 智能战斗场所切换触发器
      1. 战斗触发
      2. 退出装备管理触发
      3. 退出宠物管理触发
      4. 城市页面r快捷键刷新触发
   3. 装备经验满级提示触发器
      1. 战斗定期触发，战数尾数：19/37/59/79/97
      2. 退出装备管理触发
   4. 装备剩余空位提示触发器
      1. 战斗入手（非图鉴）触发
      2. 退出装备管理触发
   5. 装备状态数据更新触发器
      1. 战斗定期触发，战数尾数：19/37/59/79/97
      2. 战斗入手（非图鉴）触发
      3. 退出装备管理触发
   6. 宠物图鉴状态数据更新触发器
      1. 定期战斗后触发，战数尾数：83
      2. 战斗中图鉴入手触发
      3. 退出宠物管理时触发
   7. 宠物剩余空位提示触发器
      1. 非十二宫战斗有入手时触发
      2. 退出宠物管理时触发
   8. 宠物状态数据更新触发器
      1. 战斗定期触发，战数尾数：7/29/47/67/89
      2. 退出宠物管理触发
   9. 十二宫战斗宠物亲密度保持触发器
      1. 十二宫战斗触发

### 版本 4.4.2

1. 给练装备的苦逼们发下福利。
2. 新增设置项，可以为练装备的角色选择武器、防具、饰品满级的提示。
3. 启用后，如果武器、防具、饰品满级，会在主页面某三个位置显示淡红、淡绿、淡蓝背景色提醒。
4. 进出装备管理、在装备管理刷新，都会触发提示状态的更新。
5. 埋头战斗时，大约平均每20战会触发提示状态更新。
6. 在装备管理页面提供快捷的设置按钮，和设置中心保持同步。

### 版本 4.4.1

1. 个人天真新体验版。
   1. 因为时间原因，涉及报名日，比赛日等，没有完整的测试，有问题再说。
   2. 方便找到空位去报名。
   3. 取消掉报名者名字的显示，自行看头像去识别。
   4. PC版鼠标停留在头像上可以看到名字。
2. 全新的城堡情报页面，去掉那些没有意义的城堡图片，在地图上显示位置。
3. 城堡主页支持部分键盘快捷键。
4. 增加新的配置：智能战斗切换点。
   1. 自行定义智能战斗时切换场所的额外RP数值。
   2. 取值范围1~3999。
   3. 必须从小到大排列，不能有相同。

### 版本 4.4.0

1. 全新的城市情报页面。
   1. 城市情报中地图显示城市位置，鼠标停留可展示对应的城市卡片。
   2. 城市情报中可查询特产品资料。
   3. 可以根据特产品的名字查询对应的城市。
2. 快捷基于本地存储的设置，目前支持可快速设置“是否包含编外队员”。
3. 威力宝石加入禁售名单，防止误操作卖店。
4. 地图移动相关的冷却时间从55秒减到52秒。
5. 尝试将手机版战斗返回前处理逻辑和PC版保持一致，没测试，自行祈祷好运吧。

### 版本 4.3.8

1. 增加“十二宫宠物亲密”设置。
2. 启用后，十二宫战斗后正在使用的满级宠物如果亲密度低于95时，则自动补满。

### 版本 4.3.7

1. 可自行配置是否隐藏主页按钮上的快捷键提示。
2. 主页键盘快捷键实现逻辑重构。
3. 装备管理页面可快速跳转到宝石镶嵌。

### 版本 4.3.6

1. 主页面便捷按钮快捷键提示。
2. 团队管理中可设置仓储队员，仓储队员的城堡仓库、牧场不纳入统计范畴。

### 版本 4.3.5

1. 城市装备管理界面可评估选择装备的重量及对应当前角色的HIT数。
2. 宠物管理界面键盘1-4对应设置宠物4个技能学习位。
3. 城市主界面ESC直接进入驿站/客栈界面。

### 版本 4.3.4

1. 增强版宠物图鉴增加编号颜色区分宠物来源，绿色初森，蓝色中塔，红色上洞。
2. 新增设置项“给我锁死在上洞”，配合智能选择战斗场所使用，启用此设置的队员智能选择时强制上洞。

### 版本 4.3.3

1. 增强版宠物图鉴上线。
2. 宠物图鉴中可以直视缺少的图鉴有哪些。
3. 需要启用设置项“增强版宠物图鉴”。

### 版本 4.3.2

1. 十二宫战斗不触发自动战斗场所切换。
2. 判断是否切换战斗场所时不再判断是否有上洞入手，反正即便入手了还是切到上洞。

### 版本 4.3.1

1. 祭奠后自动切到上洞功能无需单独设置。
2. 自动切换到十二宫前判断自身满级。
3. 如果战斗有入手则判断额外RP清空时切到上洞（大概率干拔）。

### 版本 4.3.0

1. 新增设置：智能选择战斗场
2. 启用此设置的必要前提条件是没有设置全局战斗场所。
3. 启用时，祭奠上洞装备后自动切换战斗场所到上洞。
4. 启用时，刷新页面快捷键r功能增强：
   1. 当转职设置为允许时，战斗场所切换到上洞（没定型的人只配打上洞）。
   2. 当祭奠RP大于0时，战斗场所切换到上洞。
   3. 当前位于枫丹并且自身和宠物都满级时，战斗场所切换到十二宫。
   4. 额外RP小于100时，战斗场所切换到上洞，人总要有点低RP干拔的梦想。
   5. 额外RP小于300时，战斗场所切换到初森。
   6. 额外RP小于500时，战斗场所切换到中塔。
   7. 战斗场所切换到上洞。
5. 启用时，禁止转职的成员，且当前无祭奠，在战斗中获取额外RP时：
   1. 额外RP等于100时，切换到初森。
   2. 额外RP等于300时，切换到中塔。
   3. 额外RP等于500时，切换到上洞。
6. 免责声明：此功能设计为自用，暂时不接受定制。

### 版本 4.2.26

1. 统计报告全新改版，支持自行选择是否包含团队编外成员。
2. 上洞入手报告改版。
3. 祭奠统计报告改版。

### 版本 4.2.25

1. 抽象通用键盘快捷键构建器。
2. 口袋助手设置中可快速为自己选择战斗场所。
3. 改进团队面板中装备信息的展示。

### 版本 4.2.24

1. 团队面板中可以查询齐心装备。
2. 团队面板中可以查询使用中装备（存储数据结构增加字段）。
3. 团队面板中可以查询特定的上洞装备。

### 版本 4.2.23

1. 自动触发资产记录更新的战数尾数由79调整为73。
2. 自动触发装备库记录更新的战数尾数调整为19/37/59/79/97。
3. 快捷键u进入宠物管理。
4. 快捷键i进入个人状态。
5. 团队面板中可查询所有的经验未满的装备。
6. 团队面板中可查询威力宝石库存。

### 版本 4.2.22

1. 手机布局额外提示栏目支持宠物孵化、宠物学习技能、验证码选择错误的提示。
2. 战斗布局可设置是否胜利者站在左边，方便得知战斗胜负结果。

### 版本 4.2.21

1. 上班摸鱼模式，仅限战斗布局，战斗结果极简显示（末末大佬需要）。
2. 手机布局战斗入手单独提示（饭团子要了好久）。

### 版本 4.2.20

1. 团队面板中增加是否选择编外队员的选择框。

### 版本 4.2.19

1. 宠物管理中宠物资料表增加进退化相关宠物的编号。
2. 团队面板中增加查询团队装备的功能。
3. 团队面板中增加查询团队宠物的功能。
4. 安全战斗按钮开启并且战斗按钮当前隐藏的情况下，q快捷键直接切换战斗选项。
5. 快捷键e进入装备管理。

### 版本 4.2.18

1. 团队面板中增加威力宝石统计。
2. 反正我砸不到平均数，爱谁谁。

### 版本 4.2.17

1. 快捷键m进入冒险家公会。
2. 快捷键k进入个人天真。
3. 修正齐心丹任务文案（末末大佬提供）。
4. 战斗场所配置。
5. 手机布局十二宫战斗胜利后住宿存钱一体化。

### 版本 4.2.16

1. 键盘快捷键支持。城市主页面r刷新，s进入物品商店，p进入宠联。
2. 城市、城堡中的二级页面单击Escape键返回上级页面。
3. 装备库中增加几个上洞玩具。

### 版本 4.2.15

1. 精简，城市转职页面不再显示历史数据。
2. 精简，城市银行页面不再显示资产历史数据。
3. 城市、城堡中的二级页面支持连击Escape键返回上级页面。
4. 记录砸威力宝石的日志。

### 版本 4.2.13

1. 任务指南的数据存储从LocalStorage迁移到IndexedDB。
2. 转职报告中可以查看MP继承的分布饼图。
3. 其余非功能性重构。
4. 解决博丽灵梦在身上时会导致宠物管理页面无法显示内容的BUG。
5. 祭奠物品修改为Ajax模式，同时在数据库中记录祭奠的日志。
6. 统计报告中可查询祭奠记录。
7. 祭奠记录可导出、导入、清除。

### 版本 4.2.9

1. 转职记录数据结构重新定义（老数据需要队长执行迁移可见）。
2. 老的转职数据暂时保留一段时间，未来会删除。
3. 转职记录数据队长可执行导出和导出操作。
4. 在城市职业管理页面显示角色的转职继承历史变化趋势。

### 版本 4.2.8

1. 城市银行界面显示角色银行资产的变化。
2. 银行资产记录可以在不同浏览器之间导出导入。
3. 战斗模式首页显示当前角色的职业。
4. 战斗模式首页显示当前角色的祭奠RP，有任意入手会触发更新。

### 版本 4.2.7

1. 主体实现逐渐由同步变为异步。
2. 城市锻冶屋完成现代化改造。
3. 扩展按钮城市收益取消，改为装备修理。
4. 删除“十二宫极速战斗”设置，想体验极速战斗的请移步战斗布局。
5. 删除“战斗页自动触底”设置，默认启用。
6. 删除“战斗后强制推荐”设置，默认启用。
7. 删除"全新版皇宫任务"设置，默认启用。
8. 修正统计报表中由于宠物入手或者图鉴入手过多造成的表格布局错乱问题。

### 版本 4.2.6

1. 战斗模式支持战斗安全按钮的设置。
2. 战斗模式支持点击战斗按钮后是否自动隐藏按钮的设置。
3. 城市宠物管理界面鼠标停留在宠物图片上时显示宠物能力雷达图。
4. 战斗模式如果宠物蛋孵化成功，背景显示为天蓝色。
5. 战斗模式如果同时宠物蛋孵化成功及宠物学习新技能，背景色显示为黄色（临时）。

### 版本 4.2.5

1. 删除旧的战斗布局，仅保留战斗增强布局。
2. 删除旧的手机布局，仅保留手机战斗布局。
3. 修改时钟背景色。
4. 修改十二宫战斗后圣斗士剩余血量背景色。
5. 增加了最后战斗场景的记录（目前没有用处，后续是否有用处，也不知道）。

### 版本 4.2.4

1. 删除“自动触发存图鉴”设置，默认启用此功能。
2. 删除“自动触发存宠物”设置，默认启用此功能。
3. 删除“自动触发存装备”设置，默认启用此功能。
4. 修正战斗增强模式左上角时钟可能存在的误差。
5. 战斗增强模式十二宫未取得胜利时，显示圣斗士剩余血量。
6. 团队面板中可以查看团队的银行资产报告。

### 版本 4.2.3

1. 数据库中记录银行资产的记录（日记录）。
2. 城市银行的界面可手工触发资产记录更新。
3. 战斗结束后战数尾数为79时，自动触发资产记录更新。
4. 后续统计资产变化的趋势，赚钱多少？赚钱快慢？
5. 十二宫战斗胜利后自动存钱+住宿（仅限战斗增强模式）。
6. 修正严重的错误，战斗后自动修理功能失效。

### 版本 4.2.0

1. 添加echarts的引用。
2. 个人面板改版，增加角色能力雷达图。
3. 个人状态，增加角色能力雷达图。
4. 十二宫统计报告，增加战数分布柱状图。
5. 十二宫统计报告，增加胜率对比柱状图。

### 版本 4.1.8

1. 团队管理逻辑重新优化。
2. 队长设置标记不再单独存储（注意：升级后需要重新设置队长）。
3. 编制外人员不能成为队长。
4. 被踢出编制时如果当时是队长身份会被同时取消。
5. 增加上洞入手报告，可查询怪物及其对应的上洞出货。
6. 其他非功能性重构。

### 版本 4.1.7

1. 团队管理可设置成员是否为编外成员。
2. 编外成员不会被纳入统计的范畴。

### 版本 4.1.5

1. 战斗布局增强模式首页显示角色当前RP值。
2. RP>=1500，白色
3. RP>=1000，深红色
4. RP>=800，红色
5. RP>=500，橙色
6. 战斗有入手时刷新当前RP值（因为可能有干拔）。
7. 修正宠物名字如果数字开头可能出现的错误。
8. 注意：宠物名字不能全部数字，否则会被当做全国编号处理！可以改，懒得改了。

### 版本 4.1.2

1. 战斗布局增强模式支持皇宫任务的显示。
2. 战斗布局增强模式处理宠物学习新技能后的提示背景色。
3. 修复战斗布局增强模式更新MP时可能会错位的问题。
4. 修复战斗布局增强模式不会更新在线列表的问题。

### 版本 4.1.0

1. 重要的更新：战斗布局（增强版）。
2. 新布局仅支持PC浏览器，彻底摆脱中古口袋页面的困扰。
3. 极大限度避免了战斗过程中出现的502错误。
4. 可能会有一些细节的缺失，后续再修正。
5. 改进装备排序的算法。

### 版本 4.0.8

1. 修复严重但不紧急的BUG，本体刚入手黄金笼子，但是没有掌握贤者的时候，无法使用黄金笼子。
2. 删除“全新的商店界面”的设置，默认直接启用此功能。
3. 删除“新装备管理界面”的设置，默认直接启用此功能。
4. 删除“新宠物管理界面”的设置，默认直接启用此功能。

### 版本 4.0.7

1. 删除“全新宝石屋界面”的设置，默认直接启用此功能。
2. 删除“新职业管理界面”的设置，默认直接启用此功能。
3. 删除“战斗的返回台词”设置，战斗模式不再需要此设置。
4. 删除“战斗的住宿台词”设置，战斗模式不再需要此设置。
5. 删除“战斗的修理台词”设置，战斗模式不再需要此设置。
6. 删除“战斗的存钱台词”设置，战斗模式不再需要此设置。
7. 战斗台词结构优化。

### 版本 4.0.6

1. 重新优化转职统计报告。
2. 删除旧的上洞入手统计，详情请转向日报、周报、月报。
3. 简化/优化怪物资料加载的逻辑。
4. 果然，逃脱不了的规律。软件结构达到一定的规模后必定要开始做减法。
5. 删除多余的按钮样式以节省尺寸。
6. 删除“紧凑版战斗报告”的设置及相关功能。
7. 删除“战斗报告的动画”的设置及相关功能。
8. 删除“战斗页面大按钮”的设置及相关功能。
9. 删除“城堡管家查库存”的设置，默认直接启用此功能。
10. 删除“全新的银行界面”的设置，默认直接启用此功能。

### 版本 4.0.5

1. 怪物资料字典中增加对应的宝可梦正式官方名字。
2. 删除旧的宝可梦百科字典，百科链接改为动态生成。
3. 怪物资料字典中增加技能的数据。
4. 统计报告中增加月战报，目前支持本月和上月。
5. 月战报中从月第一天开始，每三天作为统计基准时间段。

### 版本 4.0.4

1. 怪物资料字典数据紧凑压缩。
2. 整理怪物技能名称，合并重复的技能（还有好多重复的）。
3. 灭亡歌 => 灭亡之歌
4. 神秘护身 => 神秘的守护
5. 花瓣舞 => 花瓣之舞
6. 破坏死光 => 破坏光线
7. 龙爪 => 龙之爪
8. 龙卷风 => 龙卷
9. 黑眼神 => 黑眼神(地球)
10. 亿万威力吸收 => 亿万威力吸取
11. 信号光纤 => 信号光线
12. 剑舞 => 剑之舞
13. 剧毒牙 => 剧毒之牙
14. 吹飞 => 吹飞(地球)
15. 吼叫 => 吼叫(地球)
16. 挖洞 => 挖洞(地球)
17. 百万威力吸收 => 百万威力吸取
18. 瞬间移动 => 瞬间移动(地球)
19. 羽毛舞 => 羽毛之舞
20. 放弃了，错误的技能名字实在太多了。继续摆烂吧。
21. 修正日战报中时间分布计算的BUG。
22. 怪物位置配置信息合并到资料字典中。
23. 恢复发布打包为标准模式。

### 版本 4.0.3

1. 日战报中增加遇见四天王的概率分布。
2. 日战报中增加遇见杰德天团的概率分布。
3. 日战报中显示所有入手的上洞。
4. 日战报中显示所有入手的宠物。
5. 日战报中显示所有入手的图鉴。
6. 统计报告中增加周战报，目前支持本周和上周。
7. 每周以周日为起始第一天（不可更改）。
8. 目前由于代码长度问题，打包只能改成紧凑的压缩模式。

### 版本 4.0.2

1. 当日战报（体验版）。
2. 昨日战报（体验版）。
3. 目前日战报只显示了战数数据。
4. 修正战斗记录导出导入使用同一个元素id的问题。
5. 日战报中增加战数总览。
6. 日战报中增加上洞入手总览。
7. 日战报中增加宠物入手总览。
8. 日战报中增加图鉴入手总览。
9. 日战报中增加藏宝图入手总览。
10. 日战报中增加宝石入手总览。

### 版本 4.0.0

1. 战斗日志数据可在不同浏览器之间同步。
2. 初步解决浏览器数据孤岛问题。
3. 队长可执行战斗日志同步操作（导出、导入）。
4. 导出数据有效期为上个月第一天之后的所有数据。
5. 队长可清除当前浏览器所有战斗记录数据。
6. 免责声明：数据一旦清除就无法恢复！操作需要三次确认。

### 版本 3.8.0

1. 建立战斗日志系统，目前完成了记录战斗结果之前写入战斗日志。
2. 战斗日志采用ObjectID作为唯一的ID。
3. 修正十二宫统计报告中出率的计算公式。
4. 删除设置项“入口处快速登陆”，默认为启用。
5. “快速登陆设置”修改为“团队管理”。
6. 扩展按钮“快速登陆”修改为“团队管理”。
7. 团队管理中可选定其中一位队员身份为队长。
8. 队长配置存储在LocalStorage中，队长身份未来会承载一些特殊的代码逻辑。

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