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

// 26B班级学生数据
function getFallbackData() {
  return [
    {
      name: "邵寓桥",
      gender: "男",
      birthDate: "20090427",
      grade: "大三",
      location: "安徽",
      hobby: "二刺猿"
    },
    {
      name: "孙瑜",
      gender: "男",
      birthDate: "20090330",
      grade: "大二",
      location: "江苏",
      hobby: "摄影"
    },
    {
      name: "张熙泰",
      gender: "男",
      birthDate: "20081222",
      grade: "大一",
      location: "广东",
      hobby: "足球"
    },
    {
      name: "刘锦东",
      gender: "男",
      birthDate: "20081219",
      grade: "大二",
      location: "安徽",
      hobby: "uuu 足球"
    },
    {
      name: "杨昊鸣",
      gender: "男",
      birthDate: "20081215",
      grade: "大一",
      location: "江苏",
      hobby: "足球"
    },
    {
      name: "陈子非",
      gender: "男",
      birthDate: "20081005",
      grade: "大二",
      location: "北京",
      hobby: "二刺猿"
    },
    {
      name: "赵钟悦",
      gender: "男",
      birthDate: "20080920",
      grade: "大一",
      location: "北京",
      hobby: "神人 农批"
    },
    {
      name: "院国亨",
      gender: "男",
      birthDate: "20080613",
      grade: "高三",
      location: "北京",
      hobby: "农批"
    },
    {
      name: "孔令安",
      gender: "男",
      birthDate: "20080609",
      grade: "大一",
      location: "香港",
      hobby: "追星"
    },
    {
      name: "石勃翔",
      gender: "男",
      birthDate: "20080516",
      grade: "大二",
      location: "北京",
      hobby: ""
    },
    {
      name: "田甦文",
      gender: "男",
      birthDate: "20080513",
      grade: "大二",
      location: "天津",
      hobby: "农批 足球"
    },
    {
      name: "张家齐",
      gender: "男",
      birthDate: "20080415",
      grade: "高三",
      location: "北京",
      hobby: "足球"
    },
    {
      name: "徐乐礼",
      gender: "男",
      birthDate: "20080331",
      grade: "大二",
      location: "北京",
      hobby: "二刺猿"
    },
    {
      name: "孟白",
      gender: "男",
      birthDate: "20080319",
      grade: "大二",
      location: "北京",
      hobby: ""
    },
    {
      name: "刘霁元",
      gender: "男",
      birthDate: "20080313",
      grade: "大一",
      location: "香港",
      hobby: "摄影"
    },
    {
      name: "孙瀚铮",
      gender: "男",
      birthDate: "20080312",
      grade: "高三",
      location: "北京",
      hobby: ""
    },
    {
      name: "彭厚超",
      gender: "男",
      birthDate: "20080111",
      grade: "高三",
      location: "底特律",
      hobby: ""
    },
    {
      name: "唐源博",
      gender: "男",
      birthDate: "20080111",
      grade: "大二",
      location: "北京",
      hobby: "神人"
    },
    {
      name: "李林峰",
      gender: "男",
      birthDate: "20080101",
      grade: "大二",
      location: "香港",
      hobby: "二刺猿 农批"
    },
    {
      name: "赵衍舒",
      gender: "女",
      birthDate: "20090604",
      grade: "大一",
      location: "蒙特利尔",
      hobby: "农批"
    },
    {
      name: "王孙佳悦",
      gender: "女",
      birthDate: "20090128",
      grade: "高三",
      location: "北京",
      hobby: "足球"
    },
    {
      name: "徐在菁",
      gender: "女",
      birthDate: "20080725",
      grade: "大二",
      location: "北京",
      hobby: ""
    },
    {
      name: "刘子与",
      gender: "女",
      birthDate: "20080523",
      grade: "高三",
      location: "北京",
      hobby: "追星"
    },
    {
      name: "潘玥含",
      gender: "女",
      birthDate: "20080428",
      grade: "大二",
      location: "北京",
      hobby: "农批 足球"
    },
    {
      name: "孙依瑶",
      gender: "女",
      birthDate: "20080418",
      grade: "大二",
      location: "北京",
      hobby: "追星"
    },
    {
      name: "徐晏熹",
      gender: "女",
      birthDate: "20080408",
      grade: "大二",
      location: "北京",
      hobby: ""
    },
    {
      name: "何欣蕾",
      gender: "女",
      birthDate: "20080306",
      grade: "大二",
      location: "香港",
      hobby: ""
    },
    {
      name: "范文",
      gender: "女",
      birthDate: "20080227",
      grade: "大二",
      location: "上海",
      hobby: "uuu 二刺猿 农批"
    },
    {
      name: "邓馨恬",
      gender: "女",
      birthDate: "20080207",
      grade: "大一",
      location: "悉尼",
      hobby: "二刺猿 农批"
    },
    {
      name: "张婧菲",
      gender: "女",
      birthDate: "20080202",
      grade: "高三",
      location: "北京",
      hobby: "二刺猿"
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