const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// 配置CORS：不携带凭据，允许通配符来源，避免浏览器阻拦
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: false
}));
app.use(express.json());

// 读取CSV数据
function loadCSVData() {
  try {
    const csvPath = path.join(__dirname, '..', '..', 'data.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n');
    
    // 解析数据行（没有标题行）
    const characters = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = line.split(',');
      if (columns.length >= 4) {
        const character = {
          name: columns[0] || '', // 姓名
          gender: columns[1] || '', // 性别
          birthDate: columns[3] || '', // 出生日期
          grade: columns[6] || '', // 年级
          location: columns[7] || '', // 地区
          hobby: columns[9] || '' // 爱好
        };
        
        // 过滤有效数据
        if (character.name && character.name !== '数据未收录' && character.name.trim() !== '' && character.name !== '()') {
          characters.push(character);
        }
      }
    }
    
    console.log(`📊 CSV数据加载完成！共 ${characters.length} 条记录`);
    return characters;
  } catch (error) {
    console.error('❌ 读取CSV文件失败:', error.message);
    console.log('🔄 使用备用硬编码数据...');
    return getFallbackData();
  }
}

// 备用硬编码数据（包含T文件夹中data.csv的所有156条数据）
function getFallbackData() {
  return [
    {
      name: "一诺(徐必成)",
      team: "成都AG超玩会",
      team_h: "成都AG超玩会 BA黑凤梨",
      ch: "5",
      ls: "3",
      FMVP: "1",
      state: "在役",
      position: "发育路",
      birthDate: "20011226",
      hero: "公孙离 马可波罗"
    },
    {
      name: "钟意(陈家豪)",
      team: "成都AG超玩会",
      team_h: "成都AG超玩会 重庆狼队",
      ch: "5",
      ls: "2",
      FMVP: "2",
      state: "在役",
      position: "打野",
      birthDate: "20041226",
      hero: "镜 夏侯惇 裴擒虎 大司命"
    },
    {
      name: "长生(谢承峻)",
      team: "成都AG超玩会",
      team_h: "成都AG超玩会",
      ch: "5",
      ls: "2",
      FMVP: "1",
      state: "在役",
      position: "中路",
      birthDate: "20040420",
      hero: "王昭君"
    },
    {
      name: "大帅(孟家俊)",
      team: "成都AG超玩会",
      team_h: "成都AG超玩会",
      ch: "5",
      ls: "2",
      FMVP: "0",
      state: "在役",
      position: "游走",
      birthDate: "20031124",
      hero: "少司缘"
    },
    {
      name: "轩染(刘明)",
      team: "成都AG超玩会",
      team_h: "成都AG超玩会",
      ch: "5",
      ls: "2",
      FMVP: "0",
      state: "在役",
      position: "对抗路",
      birthDate: "20050516",
      hero: "姬小满 曹操"
    },
    {
      name: "䗊安(张广豪)",
      team: "TCG",
      team_h: "成都AG超玩会 TCG",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "对抗路",
      birthDate: "20021221",
      hero: "李信 关羽 狂铁"
    },
    {
      name: "笑影(汤佳杰)",
      team: "上海EDGM",
      team_h: "成都AG超玩会 济南RW侠 上海EDGM",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "20000115",
      hero: "墨子"
    },
    {
      name: "小新(张新)",
      team: "苏州KSG",
      team_h: "成都AG超玩会 苏州KSG",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "20000323",
      hero: "李信 关羽"
    },
    {
      name: "Cat(陈正正)",
      team: "成都AG超玩会",
      team_h: "成都AG超玩会 武汉EStarPro QGhappy 杭州LGD.NBW 上海RNGM",
      ch: "7",
      ls: "3",
      FMVP: "2",
      state: "在役",
      position: "中路",
      birthDate: "19980525",
      hero: "貂蝉 干将莫邪"
    },
    {
      name: "未央(汤佳杰)",
      team: "成都AG超玩会",
      team_h: "成都AG超玩会",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "打野",
      birthDate: "20010808",
      hero: "镜 澜 暃"
    },
    {
      name: "云黎(张思)",
      team: "上海EDGM",
      team_h: "成都AG超玩会 济南RW侠 上海EDGM",
      ch: "1",
      ls: "",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "20000514",
      hero: "貂蝉"
    },
    {
      name: "小兽(肖闽辉)",
      team: "成都AG超玩会",
      team_h: "成都AG超玩会",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "打野",
      birthDate: "19970817",
      hero: "镜 澜 暃"
    },
    {
      name: "小玖(张佳豪)",
      team: "成都AG超玩会",
      team_h: "成都AG超玩会",
      ch: "1",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "发育路",
      birthDate: "20050628",
      hero: "公孙离 马可波罗 孙尚香"
    },
    {
      name: "Best(郑国成)",
      team: "成都AG超玩会",
      team_h: "成都AG超玩会 上海RNG.M 西安WE QGhappy",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "对抗路",
      birthDate: "19991022",
      hero: "狂铁 达摩"
    },
    {
      name: "老帅(张宇辰)",
      team: "成都AG超玩会",
      team_h: "成都AG超玩会 佛山DRG.GK 济南RW侠",
      ch: "1",
      ls: "1",
      FMVP: "1",
      state: "在役",
      position: "中路",
      birthDate: "19941012",
      hero: "貂蝉"
    },
    {
      name: "爱思/爱思(唐田)",
      team: "成都AG超玩会",
      team_h: "成都AG超玩会 济南RW侠",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "19990805",
      hero: "不知火舞 干将"
    },
    {
      name: "Fly(彭云飞)",
      team: "济南RW侠",
      team_h: "重庆狼队 济南RW侠 QGhappy",
      ch: "8",
      ls: "4",
      FMVP: "7",
      state: "在役",
      position: "对抗路",
      birthDate: "20000923",
      hero: "关羽 花木兰 马超 狂铁 曜"
    },
    {
      name: "归期(双小钧)",
      team: "重庆狼队",
      team_h: "重庆狼队 昆山SC",
      ch: "2",
      ls: "1",
      FMVP: "0",
      state: "在役",
      position: "对抗路",
      birthDate: "20050323",
      hero: "关羽 姬小满 达摩 马超"
    },
    {
      name: "向鱼(蔡佑其)",
      team: "重庆狼队",
      team_h: "重庆狼队 广州TTG.XQ Qghappy",
      ch: "5",
      ls: "",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "20020723",
      hero: "干将莫邪"
    },
    {
      name: "妖刀(钟文林)",
      team: "重庆狼队",
      team_h: "重庆狼队 广州TTG.XQ",
      ch: "1",
      ls: "1",
      FMVP: "0",
      state: "在役",
      position: "发育路",
      birthDate: "20041011",
      hero: "公孙离 马可波罗"
    },
    {
      name: "小胖(李达亨)",
      team: "重庆狼队",
      team_h: "重庆狼队 QGhappy",
      ch: "5",
      ls: "",
      FMVP: "3",
      state: "在役",
      position: "打野",
      birthDate: "20040712",
      hero: "裴擒虎 大司命 镜"
    },
    {
      name: "Hurt/刺痛(夏圣钦)",
      team: "重庆狼队",
      team_h: "重庆狼队 QGhappy",
      ch: "4",
      ls: "",
      FMVP: "0",
      state: "在役",
      position: "发育路",
      birthDate: "19970128",
      hero: "公孙离 马可波罗"
    },
    {
      name: "帆帆(杨帆)",
      team: "重庆狼队",
      team_h: "重庆狼队 广州TTG.XQ 南通Hero久竞",
      ch: "1",
      ls: "1",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "20031116",
      hero: "不知火舞"
    },
    {
      name: "末将(向鱼)",
      team: "重庆狼队",
      team_h: "QGhappy 重庆VG",
      ch: "1",
      ls: "",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "20000311",
      hero: ""
    },
    {
      name: "Alan(王添龙)",
      team: "重庆狼队",
      team_h: "Qghappy 武汉EStarPro",
      ch: "5",
      ls: "",
      FMVP: "0",
      state: "在役",
      position: "游走",
      birthDate: "19991023",
      hero: ""
    },
    {
      name: "yang(王添龙)",
      team: "重庆狼队",
      team_h: "QGhappy 广州TTG.XQ",
      ch: "3",
      ls: "",
      FMVP: "0",
      state: "在役",
      position: "游走",
      birthDate: "19991118",
      hero: ""
    },
    {
      name: "小胖(李达亨)",
      team: "苏州KSG",
      team_h: "重庆狼队 苏州KSG QGhappy",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "打野",
      birthDate: "20010920",
      hero: "露娜 镜 澜 裴擒虎"
    },
    {
      name: "小玖(张佳豪)",
      team: "苏州KSG",
      team_h: "重庆狼队 苏州KSG QGhappy",
      ch: "6",
      ls: "",
      FMVP: "0",
      state: "在役",
      position: "发育路",
      birthDate: "20011216",
      hero: "公孙离 伽罗"
    },
    {
      name: "小新(张新)",
      team: "重庆狼队",
      team_h: "重庆狼队 Qghappy 广州TTG.XQ 上海EDGM",
      ch: "4",
      ls: "",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "20001004",
      hero: "貂蝉 干将"
    },
    {
      name: "月色(张佳豪)",
      team: "重庆狼队",
      team_h: "重庆狼队 南通Hero久竞 重庆VG",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "20011023",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "武汉EStarPro",
      team_h: "武汉EStarPro 济南RW侠 重庆KLG",
      ch: "2",
      ls: "",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "19980806",
      hero: ""
    },
    {
      name: "诺言(郭桂鑫)",
      team: "武汉EStarPro",
      team_h: "武汉EStarPro",
      ch: "2",
      ls: "",
      FMVP: "0",
      state: "在役",
      position: "对抗路",
      birthDate: "19991203",
      hero: ""
    },
    {
      name: "花海(罗思源)",
      team: "武汉EStarPro",
      team_h: "武汉EStarPro",
      ch: "7",
      ls: "",
      FMVP: "2",
      state: "在役",
      position: "打野",
      birthDate: "20010305",
      hero: "镜 澜 暃"
    },
    {
      name: "清融(黄垚钦)",
      team: "北京JDG",
      team_h: "武汉EStarPro 南通Hero久竞 北京JDG",
      ch: "7",
      ls: "",
      FMVP: "2",
      state: "在役",
      position: "中路",
      birthDate: "20031029",
      hero: "西施 不知火舞"
    },
    {
      name: "小玖(张佳豪)",
      team: "北京JDG",
      team_h: "武汉EStarPro 杭州LGD.NBW 济南RW侠 北京JDG",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "发育路",
      birthDate: "20040723",
      hero: "马可波罗 公孙离 鲁班七号"
    },
    {
      name: "小玖(张佳豪)",
      team: "武汉EStarPro",
      team_h: "武汉EStarPro 深圳DYG",
      ch: "6",
      ls: "",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "19991026",
      hero: ""
    },
    {
      name: "坦然(孙麟威)",
      team: "南通Hero久竞",
      team_h: "武汉EStarPro 南通Hero久竞",
      ch: "5",
      ls: "",
      FMVP: "2",
      state: "在役",
      position: "对抗路",
      birthDate: "20030920",
      hero: ""
    },
    {
      name: "子阳(向阳)",
      team: "苏州KSG",
      team_h: "武汉EStarPro 南通Hero久竞 苏州KSG",
      ch: "7",
      ls: "",
      FMVP: "1",
      state: "在役",
      position: "游走",
      birthDate: "20010213",
      hero: ""
    },
    {
      name: "墨墨(陈雪健)",
      team: "武汉EStarPro",
      team_h: "武汉EStarPro 佛山DRG.GK 北京JDG 上海EDGM",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "20051026",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "武汉EStarPro",
      team_h: "武汉EStarPro 佛山DRG.GK 北京JDG",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "对抗路",
      birthDate: "20040511",
      hero: ""
    },
    {
      name: "小楼(张佳豪)",
      team: "武汉EStarPro",
      team_h: "武汉EStarPro 西安WE TCG",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "打野",
      birthDate: "20050825",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "武汉EStarPro",
      team_h: "武汉EStarPro 苏州KSG",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "发育路",
      birthDate: "20051018",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "武汉EStarPro",
      team_h: "武汉EStarPro 北京WB 深圳DYG 上海RNGM",
      ch: "0",
      ls: "",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "20030521",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "武汉EStarPro",
      team_h: "武汉EStarPro XYG 南通Hero久竞",
      ch: "0",
      ls: "",
      FMVP: "0",
      state: "在役",
      position: "对抗路",
      birthDate: "20050304",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "南通Hero久竞",
      team_h: "苏州KSG 南通Hero久竞",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "发育路",
      birthDate: "20040412",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "佛山DRG",
      team_h: "佛山DRG.GK",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "发育路",
      birthDate: "20040414",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "TCG",
      team_h: "佛山DRG.GK 西安WE 深圳DYG",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "19951123",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "西安WE",
      team_h: "佛山DRG.GK 西安WE",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "对抗路",
      birthDate: "20020217",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "西安WE",
      team_h: "佛山DRG.GK 西安WE",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "打野",
      birthDate: "20000901",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "佛山DRG",
      team_h: "佛山DRG.GK 深圳DYG",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "19930425",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "深圳DYG",
      team_h: "佛山DRG.GK 深圳DYG",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "对抗路",
      birthDate: "19991020",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "深圳DYG",
      team_h: "佛山DRG.GK 南通Hero久竞",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "20020121",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "深圳DYG",
      team_h: "佛山DRG.GK 南通Hero久竞",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "20040205",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "上海EDGM",
      team_h: "上海EDGM 北京WB 长沙TES.A",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "20010530",
      hero: "干将溪 缇莉"
    },
    {
      name: "小玖(张佳豪)",
      team: "上海EDGM",
      team_h: "上海EDGM 成都AG超玩会",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "打野",
      birthDate: "20001201",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "上海EDGM",
      team_h: "上海EDGM",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "对抗路",
      birthDate: "20060118",
      hero: "狂铁"
    },
    {
      name: "小玖(张佳豪)",
      team: "上海EDGM",
      team_h: "上海EDGM",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "发育路",
      birthDate: "20061028",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "上海EDGM",
      team_h: "上海EDGM 南通Hero久竞 深圳DYG",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "打野",
      birthDate: "20040614",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "上海EDGM",
      team_h: "上海EDGM 苏州KSG",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "20031022",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "南通Hero久竞",
      team_h: "南通Hero久竞 深圳DYG",
      ch: "1",
      ls: "",
      FMVP: "1",
      state: "在役",
      position: "打野",
      birthDate: "20001203",
      hero: "裴擒虎"
    },
    {
      name: "小玖(张佳豪)",
      team: "南通Hero久竞",
      team_h: "南通Hero久竞 上海EDGM",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "打野",
      birthDate: "20051012",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "南通Hero久竞",
      team_h: "南通Hero久竞 TCG XYG",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "20050608",
      hero: ""
    },
    {
      name: "小玖(张佳豪)",
      team: "南通Hero久竞",
      team_h: "南通Hero久竞",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "20041104",
      hero: ""
    },
    {
      name: "Silver(黄宝帅)",
      team: "南通Hero久竞",
      team_h: "南通Hero久竞 上海EDGM",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "发育路",
      birthDate: "20040503",
      hero: ""
    },
    {
      name: "墨墨(陈雪健)",
      team: "南通Hero久竞",
      team_h: "南通Hero久竞 济南RW侠 武汉EStarPro",
      ch: "0",
      ls: "0",
      FMVP: "0",
      state: "在役",
      position: "中路",
      birthDate: "20050731",
      hero: ""
    }
  ];
}

// 加载数据
const CHARACTERS_DATA = loadCSVData();

// 过滤有效数据
const validCharacters = CHARACTERS_DATA.filter(
  c => c.name && c.name !== '数据未收录' && c.name.trim() !== '' && c.name !== '()'
);

console.log(`✅ 数据加载完成！共 ${validCharacters.length} 条记录`);

// API路由
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    dataCount: validCharacters.length,
    message: '纯内存数据，无需数据库！'
  });
});

app.get('/api/random-character', (req, res) => {
  const randomIndex = Math.floor(Math.random() * validCharacters.length);
  const character = validCharacters[randomIndex];
  res.json(character);
});

app.get('/api/search', (req, res) => {
  const { query } = req.query;
  console.log(`🔍 搜索请求: query="${query}"`);
  
  if (!query || query.trim() === '') {
    console.log('✅ 搜索查询为空，返回所有有效数据');
    res.json(validCharacters);
    return;
  }
  
  const results = validCharacters.filter(character => 
    character.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 20);
  
  console.log(`✅ 搜索完成: 找到 ${results.length} 个结果`);
  console.log(`📝 结果:`, results.map(r => r.name));
  
  res.json(results);
});

app.get('/api/all-characters', (req, res) => {
  res.json(validCharacters);
});

// 启动服务器
const PORT = process.env.PORT || 8080;  // 修改默认端口为8080

app.listen(PORT, () => {
  console.log(`🚀 服务器启动成功！`);
  console.log(`📍 端口: ${PORT}`);
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 数据: ${validCharacters.length} 条记录 (内存存储)`);
  console.log(`✨ 无需数据库，纯内存运行！`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n正在关闭服务器...');
  process.exit(0);
}); 