// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from "react";
import {
  Switch,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Statistic,
  Card,
  Empty,
  message,
} from "antd";
import * as echarts from "echarts";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  FileTextOutlined,
  TranslationOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
import weekOfYear from "dayjs/plugin/weekOfYear";
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(weekOfYear);
dayjs.locale("zh-cn");
interface WorkRecord {
  id: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  description: string;
  hours: number;
}
const App: React.FC = () => {
  const [records, setRecords] = useState<WorkRecord[]>([]);
  const chartRef = React.useRef<HTMLDivElement>(null);
  // 初始化图表
  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(document.getElementById("workHoursChart"));
      // 获取最近7天的数据
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        return dayjs().subtract(i, "day").format("MM-DD");
      }).reverse();
      // 计算每天的工时
      const dailyHours = last7Days.map((date) => {
        return records.reduce((total, record) => {
          if (dayjs(record.startDate).format("MM-DD") === date) {
            return total + record.hours;
          }
          return total;
        }, 0);
      });
      const option = {
        tooltip: {
          trigger: "axis",
          formatter: "{b}<br />工时：{c} 小时",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: last7Days,
          axisLine: {
            lineStyle: {
              color: "#ddd",
            },
          },
          axisLabel: {
            color: "#666",
          },
        },
        yAxis: {
          type: "value",
          name: "工时(小时)",
          nameTextStyle: {
            color: "#666",
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: "#eee",
            },
          },
        },
        series: [
          {
            name: "日工时",
            type: "line",
            smooth: true,
            data: dailyHours,
            itemStyle: {
              color: "#1890ff",
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(24,144,255,0.2)",
                  },
                  {
                    offset: 1,
                    color: "rgba(24,144,255,0)",
                  },
                ],
              },
            },
          },
        ],
      };
      chart.setOption(option);
      // 监听窗口大小变化
      window.addEventListener("resize", () => {
        chart.resize();
      });
      return () => {
        chart.dispose();
        window.removeEventListener("resize", () => {
          chart.resize();
        });
      };
    }
  }, [records]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WorkRecord | null>(null);
  const [showInDays, setShowInDays] = useState(false);
  const [hoursPerDay, setHoursPerDay] = useState(7);
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [showChart, setShowChart] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [form] = Form.useForm();
  // 初始化示例数据
  useEffect(() => {
    const sampleRecords: WorkRecord[] = [
      {
        id: "1",
        startDate: "2025-04-18",
        startTime: "09:00",
        endDate: "2025-04-18",
        endTime: "18:00",
        description: "完成产品设计文档和用户调研报告",
        hours: 9,
      },
      {
        id: "2",
        startDate: "2025-04-17",
        startTime: "10:00",
        endDate: "2025-04-17",
        endTime: "19:30",
        description: "参加项目启动会议，准备产品原型",
        hours: 9.5,
      },
      {
        id: "3",
        startDate: "2025-04-16",
        startTime: "14:00",
        endDate: "2025-04-16",
        endTime: "22:00",
        description: "修复用户反馈的界面问题，优化交互流程",
        hours: 8,
      },
      {
        id: "4",
        startDate: "2025-04-15",
        startTime: "21:00",
        endDate: "2025-04-16",
        endTime: "01:30",
        description: "紧急处理线上问题，跨夜加班",
        hours: 4.5,
      },
      {
        id: "5",
        startDate: "2025-04-14",
        startTime: "09:30",
        endDate: "2025-04-14",
        endTime: "18:30",
        description: "进行用户访谈，整理需求文档",
        hours: 9,
      },
    ];
    setRecords(sampleRecords);
  }, []);
  const showModal = (record?: WorkRecord) => {
    if (record) {
      setEditingRecord(record);
      form.setFieldsValue({
        startDate: dayjs(record.startDate),
        startTime: dayjs(record.startTime, "HH:mm"),
        endDate: dayjs(record.endDate),
        endTime: dayjs(record.endTime, "HH:mm"),
        description: record.description,
      });
    } else {
      setEditingRecord(null);
      form.resetFields();
      form.setFieldsValue({
        startDate: dayjs(),
        endDate: dayjs(),
      });
    }
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const startDate = values.startDate.format("YYYY-MM-DD");
      const startTime = values.startTime.format("HH:mm");
      const endDate = values.endDate.format("YYYY-MM-DD");
      const endTime = values.endTime.format("HH:mm");
      // 计算工作小时数
      const start = dayjs(`${startDate} ${startTime}`);
      const end = dayjs(`${endDate} ${endTime}`);
      const hours = end.diff(start, "minute") / 60;
      if (hours < 0) {
        message.error("结束时间不能早于开始时间");
        return;
      }
      const newRecord: WorkRecord = {
        id: editingRecord ? editingRecord.id : Date.now().toString(),
        startDate,
        startTime,
        endDate,
        endTime,
        description: values.description,
        hours: parseFloat(hours.toFixed(1)),
      };
      if (editingRecord) {
        setRecords(
          records.map((r) => (r.id === editingRecord.id ? newRecord : r)),
        );
        message.success("工时记录已更新");
      } else {
        setRecords([newRecord, ...records]);
        message.success("工时记录已添加");
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };
  const deleteRecord = (id: string) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这条工时记录吗？",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        setRecords(records.filter((record) => record.id !== id));
        message.success("工时记录已删除");
      },
    });
  };
  // 计算本周工时
  const getWeeklyHours = () => {
    const now = dayjs();
    const startOfWeek = now.startOf("week");
    const endOfWeek = now.endOf("week");
    return records.reduce((total, record) => {
      const recordDate = dayjs(record.startDate);
      if (recordDate.isBetween(startOfWeek, endOfWeek, null, "[]")) {
        return total + record.hours;
      }
      return total;
    }, 0);
  };
  // 计算本月工时
  const getMonthlyHours = () => {
    const now = dayjs();
    const startOfMonth = now.startOf("month");
    const endOfMonth = now.endOf("month");
    return records.reduce((total, record) => {
      const recordDate = dayjs(record.startDate);
      if (recordDate.isBetween(startOfMonth, endOfMonth, null, "[]")) {
        return total + record.hours;
      }
      return total;
    }, 0);
  };
  const weeklyHours = getWeeklyHours();
  const monthlyHours = getMonthlyHours();
  // 小时转换为天数
  const hoursToDays = (hours: number) => {
    return (hours / hoursPerDay).toFixed(1);
  };
  // 格式化日期显示
  const formatDateRange = (startDate: string, endDate: string) => {
    if (startDate === endDate) {
      return dayjs(startDate).format("MM月DD日");
    } else {
      return `${dayjs(startDate).format("MM月DD日")} - ${dayjs(endDate).format("MM月DD日")}`;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10 px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">工时管家</h1>
        <button
          className="flex items-center text-gray-600 px-2 py-1 rounded-md"
          onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
        >
          <TranslationOutlined className="mr-1" />
          <span className="text-sm">{language === "zh" ? "EN" : "中文"}</span>
        </button>
      </div>
      {/* 主内容区域 */}
      <div className="pt-16 px-4">
        {/* 统计卡片 */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Card className="shadow-sm rounded-lg">
            <div className="flex items-center mb-2">
              <ClockCircleOutlined className="text-blue-500 mr-2" />
              <span className="text-gray-600">本周工时</span>
            </div>
            <Statistic
              value={
                showInDays ? hoursToDays(weeklyHours) : weeklyHours.toFixed(1)
              }
              suffix={showInDays ? "天" : "小时"}
              valueStyle={{ color: "#1890ff", fontWeight: "bold" }}
            />
          </Card>
          <Card className="shadow-sm rounded-lg">
            <div className="flex items-center mb-2">
              <CalendarOutlined className="text-green-500 mr-2" />
              <span className="text-gray-600">本月工时</span>
            </div>
            <Statistic
              value={
                showInDays ? hoursToDays(monthlyHours) : monthlyHours.toFixed(1)
              }
              suffix={showInDays ? "天" : "小时"}
              valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
            />
          </Card>
        </div>
        {/* 单位切换 */}
        <div className="mt-4 flex justify-end items-center">
          <div className="flex items-center mr-4">
            <span className="text-gray-500 text-sm mr-2">每天工时:</span>
            <select
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
            >
              {[6, 7, 8, 9, 10].map((hours) => (
                <option key={hours} value={hours}>
                  {hours}小时
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 text-sm mr-2">显示单位:</span>
            <span
              className={`text-sm mr-1 ${!showInDays ? "text-blue-500 font-medium" : "text-gray-500"}`}
            >
              小时
            </span>
            <Switch
              checked={showInDays}
              onChange={setShowInDays}
              size="small"
              className="bg-gray-300"
            />
            <span
              className={`text-sm ml-1 ${showInDays ? "text-blue-500 font-medium" : "text-gray-500"}`}
            >
              天
            </span>
          </div>
        </div>
        {/* 视图切换 */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!showChart && !showTimeline ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}
              onClick={() => {
                setShowChart(false);
                setShowTimeline(false);
              }}
            >
              工时记录
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showTimeline ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}
              onClick={() => {
                setShowChart(false);
                setShowTimeline(true);
              }}
            >
              时间轴
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showChart ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}
              onClick={() => {
                setShowChart(true);
                setShowTimeline(false);
              }}
            >
              工时趋势
            </button>
          </div>
        </div>
        {showChart ? (
          /* 工时统计图表 */
          <div className="mt-4">
            <Card className="shadow-sm rounded-lg">
              <div className="flex items-center mb-4">
                <h2 className="text-lg font-medium text-gray-700">工时趋势</h2>
              </div>
              <div
                id="workHoursChart"
                style={{ height: "300px", width: "100%" }}
              ></div>
            </Card>
          </div>
        ) : showTimeline ? (
          /* 时间轴视图 */
          <div className="mt-4">
            <div className="relative pl-8">
              {records.map((record) => (
                <div key={record.id} className="mb-8 relative">
                  {/* 时间轴线 */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
                  {/* 时间节点 */}
                  <div className="absolute left-[-16px] top-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md">
                    <ClockCircleOutlined />
                  </div>
                  {/* 内容卡片 */}
                  <Card
                    className="ml-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => showModal(record)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center text-gray-500 text-sm mb-1">
                          <CalendarOutlined className="mr-1" />
                          <span>
                            {formatDateRange(record.startDate, record.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm mb-2">
                          <FieldTimeOutlined className="mr-1" />
                          <span>
                            {record.startTime} - {record.endTime}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <FileTextOutlined className="text-gray-400 mt-1 mr-1" />
                          <p className="text-gray-700 break-words">
                            {record.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-blue-500 font-medium">
                          {showInDays
                            ? `${hoursToDays(record.hours)} 天`
                            : `${record.hours} 小时`}
                        </div>
                        <div className="flex mt-2">
                          <button
                            className="text-gray-400 hover:text-blue-500 p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              showModal(record);
                            }}
                          >
                            <EditOutlined />
                          </button>
                          <button
                            className="text-gray-400 hover:text-red-500 p-1 ml-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRecord(record.id);
                            }}
                          >
                            <DeleteOutlined />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 工时记录列表 */
          <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium text-gray-700">工时记录</h2>
            </div>
            {records.length > 0 ? (
              <div className="space-y-3">
                {records.map((record) => (
                  <Card
                    key={record.id}
                    className="shadow-sm rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => showModal(record)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center text-gray-500 text-sm mb-1">
                          <CalendarOutlined className="mr-1" />
                          <span>
                            {formatDateRange(record.startDate, record.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm mb-2">
                          <FieldTimeOutlined className="mr-1" />
                          <span>
                            {record.startTime} - {record.endTime}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <FileTextOutlined className="text-gray-400 mt-1 mr-1" />
                          <p className="text-gray-700 break-words">
                            {record.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-blue-500 font-medium">
                          {showInDays
                            ? `${hoursToDays(record.hours)} 天`
                            : `${record.hours} 小时`}
                        </div>
                        <div className="flex mt-2">
                          <button
                            className="text-gray-400 hover:text-blue-500 p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              showModal(record);
                            }}
                          >
                            <EditOutlined />
                          </button>
                          <button
                            className="text-gray-400 hover:text-red-500 p-1 ml-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRecord(record.id);
                            }}
                          >
                            <DeleteOutlined />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty
                description="暂无工时记录"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="my-8"
              />
            )}
          </div>
        )}
      </div>
      {/* 添加按钮 */}
      <button
        className="fixed right-4 bottom-4 w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors !rounded-button"
        onClick={() => showModal()}
      >
        <PlusOutlined style={{ fontSize: "24px" }} />
      </button>
      {/* 添加/编辑工时记录弹窗 */}
      <Modal
        title={editingRecord ? "编辑工时记录" : "添加工时记录"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item
              name="startDate"
              label="开始日期"
              rules={[{ required: true, message: "请选择开始日期" }]}
            >
              <DatePicker locale={locale} className="w-full" />
            </Form.Item>
            <Form.Item
              name="startTime"
              label="开始时间"
              rules={[{ required: true, message: "请选择开始时间" }]}
            >
              <TimePicker format="HH:mm" className="w-full" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item
              name="endDate"
              label="结束日期"
              rules={[{ required: true, message: "请选择结束日期" }]}
            >
              <DatePicker locale={locale} className="w-full" />
            </Form.Item>
            <Form.Item
              name="endTime"
              label="结束时间"
              rules={[{ required: true, message: "请选择结束时间" }]}
            >
              <TimePicker format="HH:mm" className="w-full" />
            </Form.Item>
          </div>
          <Form.Item
            name="description"
            label="工作内容"
            rules={[{ required: true, message: "请输入工作内容" }]}
          >
            <Input.TextArea rows={4} placeholder="请输入工作内容描述" />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleCancel} className="!rounded-button">
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="!rounded-button"
            >
              {editingRecord ? "保存" : "添加"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
export default App;
