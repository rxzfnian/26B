const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

console.log('🔄 开始转换CSV到XLSX...');

try {
  // 读取CSV文件 - 使用T文件夹中的data.csv
  const csvPath = path.join(__dirname, '..', 'data.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  
  // 解析CSV内容
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  // 解析数据行
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = line.split(',');
    if (columns.length >= headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = columns[index] ? columns[index].trim() : '';
      });
      data.push(row);
    }
  }
  
  console.log(`📊 解析完成！共 ${data.length} 条数据记录`);
  console.log(`📋 列标题: ${headers.join(', ')}`);
  
  // 创建工作簿
  const workbook = XLSX.utils.book_new();
  
  // 创建工作表
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // 设置列宽
  const colWidths = headers.map(header => ({
    wch: Math.max(header.length, ...data.map(row => String(row[header] || '').length))
  }));
  worksheet['!cols'] = colWidths;
  
  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, 'KPL选手数据');
  
  // 保存XLSX文件
  const outputPath = path.join(__dirname, 'data.xlsx');
  XLSX.writeFile(workbook, outputPath);
  
  console.log(`✅ 转换完成！`);
  console.log(`📁 输出文件: ${outputPath}`);
  console.log(`📊 数据行数: ${data.length}`);
  console.log(`📋 列数: ${headers.length}`);
  
} catch (error) {
  console.error('❌ 转换失败:', error.message);
  process.exit(1);
}
