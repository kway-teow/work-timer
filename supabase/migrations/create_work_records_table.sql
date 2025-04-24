-- 创建工作记录表
CREATE TABLE IF NOT EXISTS work_records (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date TEXT NOT NULL,
  start_time TEXT NOT NULL, 
  end_date TEXT NOT NULL,
  end_time TEXT NOT NULL,
  description TEXT NOT NULL,
  hours NUMERIC(8, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 启用行级安全策略
ALTER TABLE work_records ENABLE ROW LEVEL SECURITY;

-- 创建用于查询自己记录的策略
CREATE POLICY "用户可以查询自己的工作记录" 
  ON work_records 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- 创建用于插入自己记录的策略
CREATE POLICY "用户可以添加自己的工作记录" 
  ON work_records 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 创建用于更新自己记录的策略
CREATE POLICY "用户可以更新自己的工作记录" 
  ON work_records 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- 创建用于删除自己记录的策略
CREATE POLICY "用户可以删除自己的工作记录" 
  ON work_records 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 创建更新时自动设置 updated_at 的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为工作记录表添加更新时间触发器
CREATE TRIGGER update_work_records_updated_at
BEFORE UPDATE ON work_records
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 