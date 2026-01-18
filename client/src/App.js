import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Autocomplete,
  TextField,
  Table,
  
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';
import { debounce } from 'lodash';

// 本地后端地址
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const FIELDS = [
  'name', 'gender', 'birthDate', 'grade', 'location', 'hobby'
];

// 新表头映射
const FIELD_LABELS = {
  name: '姓名',
  gender: '性别',
  birthDate: '出生日期',
  grade: '年级',
  location: '地区',
  hobby: '特质'
};

// 需要数字比较的栏
const NUMBER_FIELDS = ['birthDate'];

// 计算年龄函数
function calcAge(birthDate) {
  if (!birthDate || birthDate === '数据未收录') return '数据未收录';
  
  // 确保日期格式正确（8位数字）
  if (!/^\d{8}$/.test(birthDate)) return '数据未收录';
  
  const year = parseInt(birthDate.substring(0, 4));
  const month = parseInt(birthDate.substring(4, 6));
  const day = parseInt(birthDate.substring(6, 8));
  
  const today = new Date();
  const birth = new Date(year, month - 1, day);
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age.toString();
}

// 添加数字比较函数
function compareNumbers(guess, target, field) {
  if (field === 'birthDate') {
    // 直接比较YYYYMMDD格式的日期
    const guessDate = guess[field];
    const targetDate = target[field];
    if (!guessDate || !targetDate) return '';
    if (targetDate > guessDate) return '↑'; // 目标日期更大（更年轻）
    if (targetDate < guessDate) return '↓'; // 目标日期更小（更年长）
    return '';
  }
  return '';
}

// 修改表格单元格渲染逻辑
function renderTableCell(field, guess, target) {
  if (field === 'birthDate') {
    const isEqual = guess[field] === target[field];
    return (
      <TableCell key={field} align="center">
        <span style={isEqual ? { color: 'green', fontWeight: 'bold' } : {}}>
          {guess[field]}
        </span>
        <span style={{ color: 'red', marginLeft: '2px' }}>
          {compareNumbers(guess, target, field)}
        </span>
      </TableCell>
    );
  } else if (field === 'gender' || field === 'location' || field === 'grade') {
    // 性别和地区对了要标绿
    const isEqual = guess[field] === target[field];
    return (
      <TableCell key={field} align="center">
        <span style={isEqual ? { color: 'green', fontWeight: 'bold' } : {}}>
          {guess[field] || '无'}
        </span>
      </TableCell>
    );
  } else if (field === 'hobby') {
    // 特征：空格分隔，相同标绿
    const guessFeatures = (guess[field] || '').split(' ').filter(f => f.trim());
    const targetFeatures = (target[field] || '').split(' ').filter(f => f.trim());
    return (
      <TableCell key={field} align="center">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'center' }}>
          {guessFeatures.map((feature, idx) => {
            const isMatch = targetFeatures.includes(feature);
            return (
              <span
                key={idx}
                style={{
                  color: isMatch ? 'green' : 'black',
                  fontWeight: isMatch ? 'bold' : 'normal',
                  fontSize: '0.9em',
                  padding: '1px 3px',
                  border: isMatch ? '1px solid green' : '1px solid #ccc',
                  borderRadius: '3px',
                  margin: '1px'
                }}
              >
                {feature}
              </span>
            );
          })}
        </div>
      </TableCell>
    );
  } else {
    return (
      <TableCell key={field} align="center">
        <span style={{ fontWeight: 'bold' }}>{guess[field] || '无'}</span>
      </TableCell>
    );
  }
}


function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOptions, setSearchOptions] = useState([]);
  const [targetCharacter, setTargetCharacter] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogCharacter, setDialogCharacter] = useState(null);
  const [isWin, setIsWin] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameCount, setGameCount] = useState(0); // 游戏计数
  const [hasLiuJindongAppeared, setHasLiuJindongAppeared] = useState(false); // 前五抽中是否已出刘锦东
  const [showLiuJindong, setShowLiuJindong] = useState(false); // 是否显示刘锦东特殊消息

  const fetchAllCharacters = async () => {
    try {
      const response = await axios.get(`${API_URL}/search?query=`);
      const validCharacters = response.data.filter(
        c => c.name && c.name !== '数据未收录' && c.name.trim() !== '' && c.name !== '()'
      );
      console.log('validCharacters:', validCharacters.map(c => c.name));
      
      if (validCharacters.length > 0) {
        let selectedCharacter;
        const newGameCount = gameCount + 1;
        setGameCount(newGameCount);
        
        // 抽卡逻辑：前五抽必出一次刘锦东，之后纯随机
        const liuJindong = validCharacters.find(c => c.name === '刘锦东');
        
        if (newGameCount <= 5 && !hasLiuJindongAppeared) {
          // 前五抽且还没出过刘锦东
          if (newGameCount === 5) {
            // 第5抽，保底必出刘锦东
            if (liuJindong) {
              selectedCharacter = liuJindong;
              setShowLiuJindong(true);
              setHasLiuJindongAppeared(true);
            } else {
              // 如果找不到刘锦东，随机选择
              const randomIndex = Math.floor(Math.random() * validCharacters.length);
              selectedCharacter = validCharacters[randomIndex];
            }
          } else {
            // 前4抽，随机选择，可能出刘锦东
            const randomIndex = Math.floor(Math.random() * validCharacters.length);
            selectedCharacter = validCharacters[randomIndex];
            
            // 如果随机选到了刘锦东，标记已出现
            if (selectedCharacter.name === '刘锦东') {
              setShowLiuJindong(true);
              setHasLiuJindongAppeared(true);
            }
          }
        } else {
          // 第6抽开始，或者前五抽已经出过刘锦东，纯随机
          const randomIndex = Math.floor(Math.random() * validCharacters.length);
          selectedCharacter = validCharacters[randomIndex];
          
          // 如果随机选到了刘锦东，显示特殊消息
          if (selectedCharacter.name === '刘锦东') {
            setShowLiuJindong(true);
          }
        }
        
        setTargetCharacter(selectedCharacter);
        setGuesses([]);
        setSearchQuery('');
        setSearchOptions([]);
      } else {
        setTargetCharacter(null);
        setGuesses([]);
        setSearchQuery('');
        setSearchOptions([]);
      }
    } catch (error) {
      console.error('Error fetching all characters:', error);
    }
  };

  useEffect(() => {
    fetchAllCharacters();
  }, []);

  // 使用防抖优化搜索
  const debouncedSearch = debounce(async (value) => {
    if (!value) {
      setSearchOptions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/search?query=${value}&limit=20`);
      setSearchOptions(response.data.filter(
        c => c.name && c.name !== '数据未收录' && c.name.trim() !== '' && c.name !== '()'
      ));
    } catch (error) {
      setSearchOptions([]);
    }
    setLoading(false);
  }, 300);

  const handleInputChange = (_, value) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleGuess = (character) => {
    setSearchQuery('');
    setSelectedOption(null);
    setSearchOptions([]);
    if (!targetCharacter) return;
    if (guesses.some(g => g.name === character.name)) {
      setSnackbar({ open: true, message: '不能重复猜测！' });
      return;
    }
    const newGuess = { ...character };
    setGuesses([...guesses, newGuess]);
    if (character.name === targetCharacter.name) {
      setDialogCharacter(targetCharacter);
      setIsWin(true);
      setOpenDialog(true);
      // 猜对了也算一局，增加计数
      setGameCount(prev => prev + 1);
    }
  };

  const handleSurrender = () => {
    setDialogCharacter(targetCharacter);
    setIsWin(false);
    setOpenDialog(true);
    // 投降也算一局，增加计数
    setGameCount(prev => prev + 1);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setShowLiuJindong(false); // 重置刘锦东显示状态
    // 每次关闭弹窗都算一局，直接调用fetchAllCharacters
    fetchAllCharacters();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: '' });
  };

  return (
    <Container maxWidth="md" sx={{ position: 'relative' }}>
      <Box sx={{ my: 4 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="outlined" onClick={fetchAllCharacters}>
            新游戏
          </Button>
          <Button variant="contained" color="error" onClick={handleSurrender}>
            投降
          </Button>
        </Stack>
        <Box sx={{ mb: 4 }}>
          <Autocomplete
            freeSolo={false}
            options={searchOptions}
            getOptionLabel={option => option.name || ''}
            value={selectedOption}
            onChange={(_, value) => {
              if (value) handleGuess(value);
              setSelectedOption(null);
            }}
            inputValue={searchQuery}
            onInputChange={handleInputChange}
            loading={loading}
            filterOptions={x => x}
            disablePortal
            disabled={targetCharacter === null}
            renderInput={(params) => (
              <TextField {...params} label="输入名字以查询你的同学：" fullWidth
                InputProps={{ ...params.InputProps, style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option._id} style={{ fontSize: 16, padding: 8 }}>
                {option.name}
              </li>
            )}
            open={!!searchQuery && searchOptions.length > 0}
          />
        </Box>

        {/* 猜测历史表格化 */}
        {guesses.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                猜测历史
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {FIELDS.map(field => (
                        <TableCell key={field} align="center" sx={{ fontWeight: 'bold', background: '#f5f5f5', fontSize: 14 }}>{FIELD_LABELS[field]}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {guesses.slice().reverse().map((guess, index) => (
                      <TableRow key={index}>
                        {FIELDS.map(field => {
                          return renderTableCell(field, guess, targetCharacter);
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* 资料卡片弹窗 */}
        <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {isWin ? '恭喜你猜对了！' : '谜底人物资料'}
          </DialogTitle>
          <DialogContent>
            {targetCharacter === null ? (
              <Typography color="error">没有可用选手，请检查数据！</Typography>
            ) : dialogCharacter && (
              <Box>
                {showLiuJindong && dialogCharacter.name === '刘锦东' ? (
                  <Box sx={{ textAlign: 'center' }}>
                    {isWin ? (
                      // 猜对了的情况
                      <>
                        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                          恭喜你猜到了伟大的uuu之神，相信你也为他着迷吧！
                        </Typography>
                        <Box sx={{ my: 2 }}>
                          <img 
                            src="/liu-jindong.png" 
                            alt="刘锦东" 
                            style={{ 
                              maxWidth: '100%', 
                              height: 'auto',
                              borderRadius: '8px',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }} 
                          />
                        </Box>
                      </>
                    ) : (
                      // 投降的情况
                      <>
                        <Typography variant="h4" fontWeight="bold" gutterBottom color="error">
                          你居然没有猜到伟大的uuu之神，等待接受神罚吧！
                        </Typography>
                        <Box sx={{ my: 2 }}>
                          <img 
                            src="/liu-jindong-surrender.png" 
                            alt="刘锦东神罚" 
                            style={{ 
                              maxWidth: '100%', 
                              height: 'auto',
                              borderRadius: '8px',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }} 
                          />
                        </Box>
                      </>
                    )}
                    <Typography variant="h5" fontWeight="bold" gutterBottom>{dialogCharacter.name}</Typography>
                    {FIELDS.slice(1).map(field => (
                      <Box key={field} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 'bold' }}>{FIELD_LABELS[field]}：</Typography>
                        {field === 'birthDate'
                          ? <Chip label={dialogCharacter[field]} size="small" sx={{ mr: 0.5 }} />
                          : <Chip label={dialogCharacter[field] || '无'} size="small" sx={{ mr: 0.5 }} />}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>{dialogCharacter.name}</Typography>
                    {FIELDS.slice(1).map(field => (
                      <Box key={field} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 'bold' }}>{FIELD_LABELS[field]}：</Typography>
                        {field === 'birthDate'
                          ? <Chip label={dialogCharacter[field]} size="small" sx={{ mr: 0.5 }} />
                          : <Chip label={dialogCharacter[field] || '无'} size="small" sx={{ mr: 0.5 }} />}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} variant="contained">新游戏</Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default App; 
