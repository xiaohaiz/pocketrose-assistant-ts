import _ from "lodash";

class PetLocationLoader {

    static getPetLocation(name: string) {
        // @ts-ignore
        const value = pokemonStag[name];
        if (value === undefined) {
            return null;
        }
        return _.split(value, " ")[1];
    }

}

const pokemonStag = {
    '妙蛙种子(001)': '妙蛙种子(001) 初森',
    '妙蛙草(002)': '妙蛙草(002) 中塔',
    '妙蛙花(003)': '妙蛙花(003) 上洞',
    '小火龙(004)': '小火龙(004) 初森',
    '火恐龙(005)': '火恐龙(005) 中塔',
    '喷火龙(006)': '喷火龙(006) 上洞',
    '杰尼龟(007)': '杰尼龟(007) 初森',
    '卡咪龟(008)': '卡咪龟(008) 中塔',
    '水箭龟(009)': '水箭龟(009) 上洞',
    '绿毛虫(010)': '绿毛虫(010) 初森',
    '铁甲蛹(011)': '铁甲蛹(011) 中塔',
    '巴大蝴(012)': '巴大蝴(012) 上洞',
    '独角虫(013)': '独角虫(013) 初森',
    '铁壳昆(014)': '铁壳昆(014) 中塔',
    '大针蜂(015)': '大针蜂(015) 上洞',
    '波波(016)': '波波(016) 初森',
    '比比鸟(017)': '比比鸟(017) 中塔',
    '比雕(018)': '比雕(018) 上洞',
    '小拉达(019)': '小拉达(019) 初森',
    '拉达(020)': '拉达(020) 中塔',
    '烈雀(021)': '烈雀(021) 初森',
    '尖嘴鸟(022)': '尖嘴鸟(022) 中塔',
    '阿柏蛇(023)': '阿柏蛇(023) 初森',
    '阿柏怪(024)': '阿柏怪(024) 中塔',
    '皮卡丘(025)': '皮卡丘(025) 初森',
    '雷丘(026)': '雷丘(026) 中塔',
    '穿山鼠(027)': '穿山鼠(027) 初森',
    '穿山王(028)': '穿山王(028) 中塔',
    '尼多兰(029)': '尼多兰(029) 初森',
    '尼多莉娜(030)': '尼多莉娜(030) 中塔',
    '尼多后(031)': '尼多后(031) 上洞',
    '尼多朗(032)': '尼多朗(032) 初森',
    '尼多利诺(033)': '尼多利诺(033) 中塔',
    '尼多王(034)': '尼多王(034) 上洞',
    '皮皮(035)': '皮皮(035) 初森',
    '皮可西(036)': '皮可西(036) 中塔',
    '六尾(037)': '六尾(037) 初森',
    '九尾(038)': '九尾(038) 中塔',
    '胖丁(039)': '胖丁(039) 初森',
    '胖可丁(040)': '胖可丁(040) 中塔',
    '超音蝠(041)': '超音蝠(041) 初森',
    '大嘴蝠(042)': '大嘴蝠(042) 中塔',
    '走路草(043)': '走路草(043) 初森',
    '臭臭花(044)': '臭臭花(044) 中塔',
    '霸王花(045)': '霸王花(045) 上洞',
    '派拉斯(046)': '派拉斯(046) 初森',
    '派拉斯特(047)': '派拉斯特(047) 中塔',
    '毛球(048)': '毛球(048) 初森',
    '末入蛾(049)': '末入蛾(049) 中塔',
    '地鼠(050)': '地鼠(050) 初森',
    '三地鼠(051)': '三地鼠(051) 中塔',
    '喵喵(052)': '喵喵(052) 初森',
    '猫老大(053)': '猫老大(053) 中塔',
    '可达鸭(054)': '可达鸭(054) 初森',
    '哥达鸭(055)': '哥达鸭(055) 中塔',
    '猴怪(056)': '猴怪(056) 初森',
    '火爆猴(057)': '火爆猴(057) 中塔',
    '卡蒂狗(058)': '卡蒂狗(058) 初森',
    '风速狗(059)': '风速狗(059) 中塔',
    '蚊香蝌蚪(060)': '蚊香蝌蚪(060) 初森',
    '蚊香蛙(061)': '蚊香蛙(061) 中塔',
    '快泳蛙(062)': '快泳蛙(062) 上洞',
    '凯西(063)': '凯西(063) 初森',
    '勇吉拉(064)': '勇吉拉(064) 中塔',
    '胡地(065)': '胡地(065) 上洞',
    '腕力(066)': '腕力(066) 初森',
    '豪力(067)': '豪力(067) 中塔',
    '怪力(068)': '怪力(068) 上洞',
    '喇叭芽(069)': '喇叭芽(069) 初森',
    '口朵花(070)': '口朵花(070) 中塔',
    '大食花(071)': '大食花(071) 上洞',
    '玛瑙水母(072)': '玛瑙水母(072) 初森',
    '毒刺水母(073)': '毒刺水母(073) 中塔',
    '小拳石(074)': '小拳石(074) 初森',
    '隆隆石(075)': '隆隆石(075) 中塔',
    '隆隆岩(076)': '隆隆岩(076) 上洞',
    '小火马(077)': '小火马(077) 上洞',
    '烈焰马(078)': '烈焰马(078) 上洞',
    '呆呆兽(079)': '呆呆兽(079) 初森',
    '呆河马(080)': '呆河马(080) 中塔',
    '小磁怪(081)': '小磁怪(081) 初森',
    '三合一磁怪(082)': '三合一磁怪(082) 中塔',
    '大葱鸭(083)': '大葱鸭(083) 初森',
    '嘟嘟(084)': '嘟嘟(084) 初森',
    '嘟嘟利(085)': '嘟嘟利(085) 中塔',
    '小海狮(086)': '小海狮(086) 初森',
    '白海狮(087)': '白海狮(087) 中塔',
    '臭泥(088)': '臭泥(088) 初森',
    '臭臭泥(089)': '臭臭泥(089) 中塔',
    '大舌贝(090)': '大舌贝(090) 初森',
    '铁甲贝(091)': '铁甲贝(091) 中塔',
    '鬼斯(092)': '鬼斯(092) 初森',
    '鬼斯通(093)': '鬼斯通(093) 中塔',
    '耿鬼(094)': '耿鬼(094) 上洞',
    '大岩蛇(095)': '大岩蛇(095) 上洞',
    '素利普(096)': '素利普(096) 初森',
    '素利柏(097)': '素利柏(097) 中塔',
    '大钳蟹(098)': '大钳蟹(098) 初森',
    '巨钳蟹(099)': '巨钳蟹(099) 中塔',
    '雷电球(100)': '雷电球(100) 初森',
    '顽皮蛋(101)': '顽皮蛋(101) 中塔',
    '蛋蛋(102)': '蛋蛋(102) 初森',
    '椰蛋树(103)': '椰蛋树(103) 中塔',
    '可拉可拉(104)': '可拉可拉(104) 初森',
    '嘎拉嘎拉(105)': '嘎拉嘎拉(105) 中塔',
    '沙瓦郎(106)': '沙瓦郎(106) 初森',
    '艾比郎(107)': '艾比郎(107) 中塔',
    '大舌头(108)': '大舌头(108) 初森',
    '瓦斯弹(109)': '瓦斯弹(109) 上洞',
    '双弹瓦斯(110)': '双弹瓦斯(110) 上洞',
    '铁甲犀牛(111)': '铁甲犀牛(111) 上洞',
    '铁甲暴龙(112)': '铁甲暴龙(112) 上洞',
    '吉利蛋(113)': '吉利蛋(113) 初森',
    '蔓藤怪(114)': '蔓藤怪(114) 初森',
    '袋龙(115)': '袋龙(115) 初森',
    '墨海马(116)': '墨海马(116) 初森',
    '海刺龙(117)': '海刺龙(117) 中塔',
    '角金鱼(118)': '角金鱼(118) 初森',
    '金鱼王(119)': '金鱼王(119) 中塔',
    '海星星(120)': '海星星(120) 初森',
    '宝石海星(121)': '宝石海星(121) 中塔',
    '吸盘魔偶(122)': '吸盘魔偶(122) 初森',
    '飞天螳螂(123)': '飞天螳螂(123) 初森',
    '迷唇姐(124)': '迷唇姐(124) 中塔',
    '电击兽(125)': '电击兽(125) 初森',
    '鸭嘴火龙(126)': '鸭嘴火龙(126) 初森',
    '大甲(127)': '大甲(127) 初森',
    '肯泰罗(128)': '肯泰罗(128) 初森',
    '鲤鱼王(129)': '鲤鱼王(129) 上洞',
    '暴鲤龙(130)': '暴鲤龙(130) 上洞',
    '拉普拉斯(131)': '拉普拉斯(131) 初森',
    '百变怪(132)': '百变怪(132) 初森',
    '伊布(133)': '伊布(133) 初森',
    '水精灵(134)': '水精灵(134) 中塔',
    '雷精灵(135)': '雷精灵(135) 上洞',
    '火精灵(136)': '火精灵(136) 上洞',
    '3D龙(137)': '3D龙(137) 上洞',
    '菊石兽(138)': '菊石兽(138) 初森',
    '多刺菊石兽(139)': '多刺菊石兽(139) 中塔',
    '化石盔(140)': '化石盔(140) 上洞',
    '镰刀盔(141)': '镰刀盔(141) 上洞',
    '化石翼龙(142)': '化石翼龙(142) 初森',
    '卡比兽(143)': '卡比兽(143) 初森',
    '冷冻鸟(144)': '冷冻鸟(144) 初森',
    '闪电鸟(145)': '闪电鸟(145) 初森',
    '火焰鸟(146)': '火焰鸟(146) 初森',
    '迷你龙(147)': '迷你龙(147) 初森',
    '哈克龙(148)': '哈克龙(148) 中塔',
    '快龙(149)': '快龙(149) 上洞',
    '超梦(150)': '超梦(150) 初森',
    '梦幻(151)': '梦幻(151) 初森',
    '奇科莉塔(152)': '奇科莉塔(152) 初森',
    '小花兽(153)': '小花兽(153) 中塔',
    '巨花兽(154)': '巨花兽(154) 上洞',
    '火岚兽(155)': '火岚兽(155) 初森',
    '熔岩兽(156)': '熔岩兽(156) 中塔',
    '爆风兽(157)': '爆风兽(157) 上洞',
    '诺可鳄(158)': '诺可鳄(158) 初森',
    '艾莉鳄(159)': '艾莉鳄(159) 中塔',
    '大丹鳄(160)': '大丹鳄(160) 上洞',
    '立尾鼠(161)': '立尾鼠(161) 上洞',
    '大立尾鼠(162)': '大立尾鼠(162) 上洞',
    '呵呵鹰(163)': '呵呵鹰(163) 初森',
    '夜鹰(164)': '夜鹰(164) 中塔',
    '金龟虫(165)': '金龟虫(165) 初森',
    '金龟战士(166)': '金龟战士(166) 中塔',
    '独角蛛(167)': '独角蛛(167) 上洞',
    '大独角蛛(168)': '大独角蛛(168) 上洞',
    '双翼蝙蝠(169)': '双翼蝙蝠(169) 上洞',
    '双灯鱼(170)': '双灯鱼(170) 初森',
    '大双灯鱼(171)': '大双灯鱼(171) 中塔',
    '皮丘(172)': '皮丘(172) 上洞',
    '皮(173)': '皮(173) 上洞',
    '布布林(174)': '布布林(174) 上洞',
    '波克比(175)': '波克比(175) 初森',
    '飞翼兽(176)': '飞翼兽(176) 中塔',
    '玩偶鸟(177)': '玩偶鸟(177) 上洞',
    '预言鸟(178)': '预言鸟(178) 上洞',
    '电电羊(179)': '电电羊(179) 初森',
    '羊咩咩(180)': '羊咩咩(180) 中塔',
    '电龙(181)': '电龙(181) 上洞',
    '美丽花(182)': '美丽花(182) 上洞',
    '水鼠(183)': '水鼠(183) 初森',
    '大水鼠(184)': '大水鼠(184) 中塔',
    '骗人树(185)': '骗人树(185) 上洞',
    '蚊香蛙王(186)': '蚊香蛙王(186) 上洞',
    '羽毛树(187)': '羽毛树(187) 初森',
    '波波树(188)': '波波树(188) 中塔',
    '棉花树(189)': '棉花树(189) 上洞',
    '长尾猴(190)': '长尾猴(190) 初森',
    '悠闲种子(191)': '悠闲种子(191) 中塔',
    '向日葵(192)': '向日葵(192) 上洞',
    '花羽蜻蜓(193)': '花羽蜻蜓(193) 上洞',
    '小嵘(194)': '小嵘(194) 上洞',
    '呆呆嵘(195)': '呆呆嵘(195) 上洞',
    '艾菲狐(196)': '艾菲狐(196) 初森',
    '小黑兔(197)': '小黑兔(197) 初森',
    '夜乌鸦(198)': '夜乌鸦(198) 初森',
    '河马国王(199)': '河马国王(199) 上洞',
    '梦魔(200)': '梦魔(200) 初森',
    '未知(201)': '未知(201) 初森',
    '忍耐龙(202)': '忍耐龙(202) 初森',
    '麒麟奇(203)': '麒麟奇(203) 初森',
    '松果怪(204)': '松果怪(204) 初森',
    '具壳怪(205)': '具壳怪(205) 中塔',
    '土龙(206)': '土龙(206) 初森',
    '大钳虫(207)': '大钳虫(207) 初森',
    '钢牙龙(208)': '钢牙龙(208) 上洞',
    '布鲁(209)': '布鲁(209) 上洞',
    '大布鲁(210)': '大布鲁(210) 上洞',
    '千针豚(211)': '千针豚(211) 初森',
    '哈萨姆(212)': '哈萨姆(212) 中塔',
    '洞洞龟(213)': '洞洞龟(213) 初森',
    '大力甲虫(214)': '大力甲虫(214) 初森',
    '梦拉(215)': '梦拉(215) 初森',
    '公主熊(216)': '公主熊(216) 中塔',
    '圈圈熊(217)': '圈圈熊(217) 上洞',
    '无壳蜗牛(218)': '无壳蜗牛(218) 初森',
    '粘液蜗牛(219)': '粘液蜗牛(219) 中塔',
    '乌利猪(220)': '乌利猪(220) 初森',
    '伊诺猪(221)': '伊诺猪(221) 中塔',
    '赛尼珊瑚(222)': '赛尼珊瑚(222) 初森',
    '怪蛙鱼(223)': '怪蛙鱼(223) 上洞',
    '石章鱼(224)': '石章鱼(224) 上洞',
    '吉利鸟(225)': '吉利鸟(225) 上洞',
    '阿扁鱼(226)': '阿扁鱼(226) 初森',
    '巨鸟(227)': '巨鸟(227) 初森',
    '恶魔犬(228)': '恶魔犬(228) 初森',
    '地狱犬(229)': '地狱犬(229) 中塔',
    '海马龙(230)': '海马龙(230) 上洞',
    '芝麻象(231)': '芝麻象(231) 上洞',
    '大牙象(232)': '大牙象(232) 上洞',
    '3D龙2(233)': '3D龙2(233) 上洞',
    '惊角鹿(234)': '惊角鹿(234) 初森',
    '画画犬(235)': '画画犬(235) 上洞',
    '巴路奇(236)': '巴路奇(236) 上洞',
    '卡波耶拉(237)': '卡波耶拉(237) 上洞',
    '大眼娃(238)': '大眼娃(238) 上洞',
    '电力兽(239)': '电力兽(239) 中塔',
    '布比(240)': '布比(240) 中塔',
    '牛奶坦克(241)': '牛奶坦克(241) 初森',
    '快乐(242)': '快乐(242) 中塔',
    '雷虎(243)': '雷虎(243) 初森',
    '火狮(244)': '火狮(244) 初森',
    '水狼(245)': '水狼(245) 初森',
    '幼甲龙(246)': '幼甲龙(246) 初森',
    '小甲龙(247)': '小甲龙(247) 中塔',
    '巨大甲龙(248)': '巨大甲龙(248) 上洞',
    '路基亚(249)': '路基亚(249) 初森',
    '凤凰(250)': '凤凰(250) 初森',
    '雪拉比(251)': '雪拉比(251) 初森',
    '草蜥蜴(252)': '草蜥蜴(252) 初森',
    '草青蛙(253)': '草青蛙(253) 中塔',
    '针叶王(254)': '针叶王(254) 上洞',
    '小火鸡(255)': '小火鸡(255) 初森',
    '瓦卡火鸡(256)': '瓦卡火鸡(256) 中塔',
    '火鸡战士(257)': '火鸡战士(257) 上洞',
    '小水狗(258)': '小水狗(258) 初森',
    '水狗(259)': '水狗(259) 中塔',
    '水狗王(260)': '水狗王(260) 上洞',
    '伯秋狗(261)': '伯秋狗(261) 初森',
    '恶啸狼(262)': '恶啸狼(262) 中塔',
    '小浣熊(263)': '小浣熊(263) 上洞',
    '小臭釉(264)': '小臭釉(264) 上洞',
    '红毛虫(265)': '红毛虫(265) 初森',
    '刺角蛹(266)': '刺角蛹(266) 中塔',
    '吸管蝶(267)': '吸管蝶(267) 上洞',
    '刺角昆(268)': '刺角昆(268) 初森',
    '半莲毒蛾(269)': '半莲毒蛾(269) 中塔',
    '哈斯荷叶(270)': '哈斯荷叶(270) 初森',
    '哈斯荷童(271)': '哈斯荷童(271) 中塔',
    '荷叶鸭(272)': '荷叶鸭(272) 上洞',
    '坚果球(273)': '坚果球(273) 初森',
    '坚果怪(274)': '坚果怪(274) 中塔',
    '木天狗(275)': '木天狗(275) 上洞',
    '思巴燕(276)': '思巴燕(276) 上洞',
    '奥思巴燕(277)': '奥思巴燕(277) 上洞',
    '小海鸥(278)': '小海鸥(278) 初森',
    '大嘴鹈鹕(279)': '大嘴鹈鹕(279) 中塔',
    '拉托斯(280)': '拉托斯(280) 初森',
    '凯利阿(281)': '凯利阿(281) 中塔',
    '超能女皇(282)': '超能女皇(282) 上洞',
    '阿美蛛(283)': '阿美蛛(283) 初森',
    '阿美蝶(284)': '阿美蝶(284) 中塔',
    '凯诺菇(285)': '凯诺菇(285) 上洞',
    '凯诺战士(286)': '凯诺战士(286) 上洞',
    '小懒熊(287)': '小懒熊(287) 初森',
    '长臂猿(288)': '长臂猿(288) 中塔',
    '大猩猩(289)': '大猩猩(289) 上洞',
    '掘地虫(290)': '掘地虫(290) 初森',
    '巨翅蝉(291)': '巨翅蝉(291) 中塔',
    '鬼蝉蛹(292)': '鬼蝉蛹(292) 上洞',
    '音波兔(293)': '音波兔(293) 初森',
    '圆耳兔(294)': '圆耳兔(294) 中塔',
    '噪音王(295)': '噪音王(295) 上洞',
    '拳击兔(296)': '拳击兔(296) 初森',
    '相扑兔(297)': '相扑兔(297) 中塔',
    '小水鼠(298)': '小水鼠(298) 上洞',
    '磁石怪(299)': '磁石怪(299) 初森',
    '手尾猫(300)': '手尾猫(300) 初森',
    '圆环猫(301)': '圆环猫(301) 中塔',
    '地狱超人(302)': '地狱超人(302) 初森',
    '巨嘴秋(303)': '巨嘴秋(303) 初森',
    '钢甲小子(304)': '钢甲小子(304) 初森',
    '钢甲犀牛(305)': '钢甲犀牛(305) 中塔',
    '钢甲暴龙(306)': '钢甲暴龙(306) 上洞',
    '阿萨那恩(307)': '阿萨那恩(307) 上洞',
    '丘雷姆(308)': '丘雷姆(308) 上洞',
    '疾电狗(309)': '疾电狗(309) 上洞',
    '电气狗(310)': '电气狗(310) 上洞',
    '正电兔(311)': '正电兔(311) 初森',
    '负电兔(312)': '负电兔(312) 初森',
    '巴鲁胖蜂(313)': '巴鲁胖蜂(313) 初森',
    '伊露胖蜂(314)': '伊露胖蜂(314) 中塔',
    '芭蕾玫瑰(315)': '芭蕾玫瑰(315) 上洞',
    '吞食兽(316)': '吞食兽(316) 上洞',
    '吞食王(317)': '吞食王(317) 上洞',
    '三色食人鱼(318)': '三色食人鱼(318) 初森',
    '大口食人鲨(319)': '大口食人鲨(319) 中塔',
    '肥波鲸(320)': '肥波鲸(320) 上洞',
    '鲸鱼王(321)': '鲸鱼王(321) 上洞',
    '沙漠骆驼(322)': '沙漠骆驼(322) 上洞',
    '火山骆驼(323)': '火山骆驼(323) 上洞',
    '熔岩乌龟(324)': '熔岩乌龟(324) 上洞',
    '弹簧小猪(325)': '弹簧小猪(325) 上洞',
    '布比猪(326)': '布比猪(326) 上洞',
    '圈圈兔(327)': '圈圈兔(327) 初森',
    '拿古拉(328)': '拿古拉(328) 初森',
    '拉巴蜻蜓(329)': '拉巴蜻蜓(329) 中塔',
    '拉巴飞龙(330)': '拉巴飞龙(330) 上洞',
    '南瓜仙人球(331)': '南瓜仙人球(331) 初森',
    '塔斯仙人掌(332)': '塔斯仙人掌(332) 中塔',
    '云彩雀(333)': '云彩雀(333) 初森',
    '碧云龙(334)': '碧云龙(334) 中塔',
    '雪山狐猫(335)': '雪山狐猫(335) 初森',
    '红牙响尾蛇(336)': '红牙响尾蛇(336) 初森',
    '月亮神石(337)': '月亮神石(337) 初森',
    '太阳神石(338)': '太阳神石(338) 初森',
    '小鲶鱼(339)': '小鲶鱼(339) 初森',
    '地震鲶鱼(340)': '地震鲶鱼(340) 中塔',
    '双钳龙虾(341)': '双钳龙虾(341) 上洞',
    '钢钳龙虾(342)': '钢钳龙虾(342) 上洞',
    '土偶怪(343)': '土偶怪(343) 初森',
    '三合一土偶(344)': '三合一土偶(344) 中塔',
    '向日古花(345)': '向日古花(345) 初森',
    '噬人古花(346)': '噬人古花(346) 中塔',
    '硬甲古蝎(347)': '硬甲古蝎(347) 初森',
    '盔甲蝎(348)': '盔甲蝎(348) 中塔',
    '丑鲤鱼(349)': '丑鲤鱼(349) 初森',
    '美丽龙(350)': '美丽龙(350) 中塔',
    '天气小子(351)': '天气小子(351) 初森',
    '隐身龙(352)': '隐身龙(352) 中塔',
    '鬼影娃娃(353)': '鬼影娃娃(353) 初森',
    '链嘴幽魂(354)': '链嘴幽魂(354) 中塔',
    '夜游灵(355)': '夜游灵(355) 初森',
    '黑乃伊(356)': '黑乃伊(356) 中塔',
    '热带雷龙(357)': '热带雷龙(357) 上洞',
    '蓝风铃(358)': '蓝风铃(358) 初森',
    '黑面雪狐(359)': '黑面雪狐(359) 中塔',
    '小忍耐龙(360)': '小忍耐龙(360) 中塔',
    '由基瓦拉(361)': '由基瓦拉(361) 上洞',
    '巨头冰怪(362)': '巨头冰怪(362) 上洞',
    '波波海象(363)': '波波海象(363) 初森',
    '古拉海象(364)': '古拉海象(364) 中塔',
    '海象牙王(365)': '海象牙王(365) 上洞',
    '帕鲁蚌(366)': '帕鲁蚌(366) 初森',
    '巨嘴鳗(367)': '巨嘴鳗(367) 中塔',
    '尖头鳗(368)': '尖头鳗(368) 上洞',
    '地图石鱼(369)': '地图石鱼(369) 初森',
    '心形鱼(370)': '心形鱼(370) 初森',
    '塔祖贝龙(371)': '塔祖贝龙(371) 初森',
    '龙龙贝(372)': '龙龙贝(372) 中塔',
    '血翼飞龙(373)': '血翼飞龙(373) 上洞',
    '独眼达恩(374)': '独眼达恩(374) 初森',
    '双臂恩古(375)': '双臂恩古(375) 中塔',
    '钢铁螃蟹(376)': '钢铁螃蟹(376) 上洞',
    '岩神柱(377)': '岩神柱(377) 初森',
    '冰神柱(378)': '冰神柱(378) 中塔',
    '钢神柱(379)': '钢神柱(379) 上洞',
    '拉迪阿斯(380)': '拉迪阿斯(380) 上洞',
    '拉迪奥斯(381)': '拉迪奥斯(381) 上洞',
    '海皇牙(382)': '海皇牙(382) 上洞',
    '古拉顿(383)': '古拉顿(383) 上洞',
    '天空之龙(384)': '天空之龙(384) 上洞',
    '月映兽(385)': '月映兽(385) 上洞',
    '迪奥西斯(386)': '迪奥西斯(386) 上洞',
    '树苗龟(387)': '树苗龟(387) 初森',
    '树林龟(388)': '树林龟(388) 中塔',
    '地壳龟(389)': '地壳龟(389) 上洞',
    '火苗猴(390)': '火苗猴(390) 初森',
    '猛火猴(391)': '猛火猴(391) 中塔',
    '豪火猴(392)': '豪火猴(392) 上洞',
    '侯企鹅(393)': '侯企鹅(393) 初森',
    '王企鹅(394)': '王企鹅(394) 中塔',
    '皇帝企鹅(395)': '皇帝企鹅(395) 上洞',
    '胖胖翁(396)': '胖胖翁(396) 初森',
    '大胖翁(397)': '大胖翁(397) 中塔',
    '长冠翁(398)': '长冠翁(398) 上洞',
    '钝河狸(399)': '钝河狸(399) 初森',
    '河狸精灵(400)': '河狸精灵(400) 中塔',
    '胖蟋蟀(401)': '胖蟋蟀(401) 初森',
    '蟋蟀战士(402)': '蟋蟀战士(402) 中塔',
    '小电狮(403)': '小电狮(403) 初森',
    '电光狮(404)': '电光狮(404) 中塔',
    '雷鸣狮(405)': '雷鸣狮(405) 上洞',
    '玫瑰花苞(406)': '玫瑰花苞(406) 初森',
    '万花蔷薇(407)': '万花蔷薇(407) 中塔',
    '小骨龙(408)': '小骨龙(408) 初森',
    '暴骨龙(409)': '暴骨龙(409) 中塔',
    '甲盾兽(410)': '甲盾兽(410) 上洞',
    '钢盾兽(411)': '钢盾兽(411) 上洞',
    '蓑衣虫(412)': '蓑衣虫(412) 初森',
    '叶衣虫(413)': '叶衣虫(413) 中塔',
    '亮翅蛾(414)': '亮翅蛾(414) 初森',
    '三合一蜂巢(415)': '三合一蜂巢(415) 中塔',
    '蜂女皇(416)': '蜂女皇(416) 上洞',
    '电松鼠(417)': '电松鼠(417) 初森',
    '叉尾鼬(418)': '叉尾鼬(418) 中塔',
    '海鼬王(419)': '海鼬王(419) 上洞',
    '樱桃芽(420)': '樱桃芽(420) 初森',
    '樱桃花(421)': '樱桃花(421) 中塔',
    '无壳龙(422)': '无壳龙(422) 初森',
    '地贝龙(423)': '地贝龙(423) 中塔',
    '双尾猴(424)': '双尾猴(424) 上洞',
    '气球仔(425)': '气球仔(425) 初森',
    '幽灵气球(426)': '幽灵气球(426) 中塔',
    '棉花兔(427)': '棉花兔(427) 初森',
    '女郎兔(428)': '女郎兔(428) 中塔',
    '梦巫(429)': '梦巫(429) 上洞',
    '绅士鸦(430)': '绅士鸦(430) 上洞',
    '旋尾猫(431)': '旋尾猫(431) 初森',
    '胖胖猫(432)': '胖胖猫(432) 中塔',
    '金铃(433)': '金铃(433) 初森',
    '毒臭釉(434)': '毒臭釉(434) 初森',
    '恶毒釉(435)': '恶毒釉(435) 中塔',
    '镜面偶(436)': '镜面偶(436) 初森',
    '镜面图腾(437)': '镜面图腾(437) 中塔',
    '胡说盆栽(438)': '胡说盆栽(438) 上洞',
    '魔尼小丑(439)': '魔尼小丑(439) 上洞',
    '兜兜蛋(440)': '兜兜蛋(440) 初森',
    '音符鹉(441)': '音符鹉(441) 初森',
    '鬼盆栽(442)': '鬼盆栽(442) 上洞',
    '地龙宝宝(443)': '地龙宝宝(443) 初森',
    '利爪地龙(444)': '利爪地龙(444) 中塔',
    '暴地龙(445)': '暴地龙(445) 上洞',
    '刚比兽(446)': '刚比兽(446) 初森',
    '鲁力欧(447)': '鲁力欧(447) 中塔',
    '鲁卡力欧(448)': '鲁卡力欧(448) 上洞',
    '沼泽河马(449)': '沼泽河马(449) 中塔',
    '沙河马(450)': '沙河马(450) 上洞',
    '幼龙蝎(451)': '幼龙蝎(451) 初森',
    '毒龙蝎(452)': '毒龙蝎(452) 上洞',
    '毒蟾斗士(453)': '毒蟾斗士(453) 初森',
    '毒蟾王(454)': '毒蟾王(454) 上洞',
    '噬人怪草(455)': '噬人怪草(455) 上洞',
    '蝶尾鱼(456)': '蝶尾鱼(456) 初森',
    '蝶翅鱼(457)': '蝶翅鱼(457) 中塔',
    '小球飞鱼(458)': '小球飞鱼(458) 初森',
    '森林雪人(459)': '森林雪人(459) 初森',
    '巨雪人(460)': '巨雪人(460) 中塔',
    '玛纽拉(461)': '玛纽拉(461) 上洞',
    '飞碟磁怪(462)': '飞碟磁怪(462) 上洞',
    '长舌怪(463)': '长舌怪(463) 上洞',
    '钻甲暴龙(464)': '钻甲暴龙(464) 上洞',
    '树藤怪(465)': '树藤怪(465) 上洞',
    '电击魔(466)': '电击魔(466) 上洞',
    '鸭嘴炎龙(467)': '鸭嘴炎龙(467) 上洞',
    '波克鸟(468)': '波克鸟(468) 初森',
    '古蜻蜓(469)': '古蜻蜓(469) 中塔',
    '叶精灵(470)': '叶精灵(470) 初森',
    '冰精灵(471)': '冰精灵(471) 中塔',
    '巨飞蝎(472)': '巨飞蝎(472) 中塔',
    '獠牙猪(473)': '獠牙猪(473) 上洞',
    '3D龙Z(474)': '3D龙Z(474) 上洞',
    '超能战士(475)': '超能战士(475) 上洞',
    '红鼻钢(476)': '红鼻钢(476) 中塔',
    '夜魔人(477)': '夜魔人(477) 中塔',
    '雪魔女(478)': '雪魔女(478) 中塔',
    '电磁鬼(479)': '电磁鬼(479) 初森',
    '黄圣菇(480)': '黄圣菇(480) 初森',
    '红圣菇(481)': '红圣菇(481) 中塔',
    '蓝圣菇(482)': '蓝圣菇(482) 上洞',
    '迪奥鲁加(483)': '迪奥鲁加(483) 上洞',
    '帕鲁其亚(484)': '帕鲁其亚(484) 上洞',
    '岩浆巨兽(485)': '岩浆巨兽(485) 上洞',
    '恩神柱(486)': '恩神柱(486) 上洞',
    '鬼龙(487)': '鬼龙(487) 上洞',
    '梦兽(488)': '梦兽(488) 上洞',
    '菲奥奈(489)': '菲奥奈(489) 初森',
    '玛娜菲(490)': '玛娜菲(490) 上洞',
    '暗裂魔(491)': '暗裂魔(491) 上洞',
    '草刺猬(492)': '草刺猬(492) 上洞',
    '圣灵兽(493)': '圣灵兽(493) 上洞'
};

export = PetLocationLoader;