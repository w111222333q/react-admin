import React, { Component } from "react";
import { Card, Radio } from "antd";
import {
  Chart,
  registerShape,
  Geom,
  Axis,
  Tooltip,
  Interval,
  Interaction,
  Coordinate,
  Annotation,
  Legend,
} from "bizcharts";

const sliceNumber = 0.01; // 自定义 other 的图形，增加两条线

registerShape("interval", "sliceShape", {
  draw(cfg, container) {
    const points = cfg.points;
    let path = [];
    path.push(["M", points[0].x, points[0].y]);
    path.push(["L", points[1].x, points[1].y - sliceNumber]);
    path.push(["L", points[2].x, points[2].y - sliceNumber]);
    path.push(["L", points[3].x, points[3].y]);
    path.push("Z");
    path = this.parsePath(path);
    return container.addShape("path", {
      attrs: {
        fill: cfg.color,
        path: path,
      },
    });
  },
});

export default class Search extends Component {
  state = {
    radioValue: "all",
    data: [],
    total: 0,
  };

  componentDidMount() {
    this.timer = setTimeout(() => {
      // 数据源
      const data = [
        {
          type: "分类一",
          value: 27,
        },
        {
          type: "分类二",
          value: 25,
        },
        {
          type: "分类三",
          value: 18,
        },
        {
          type: "分类四",
          value: 15,
        },
        {
          type: "分类五",
          value: 10,
        },
        {
          type: "其它",
          value: 5,
        },
      ];
      this.setState({ data, total: data.reduce((p, c) => p + c.value, 0) });
    }, 1000);
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  onRadioChange = (e) => {
    this.setState({
      radioValue: e.target.value,
    });
  };

  // 点击区域触发
  IntervalClick = (ev) => {
    const data = ev.data;
    this.setState({
      total: data.data.value,
    });
  };

  render() {
    const { radioValue, data, total } = this.state;

    return (
      <Card
        title="销售额类型占比"
        extra={
          <Radio.Group onChange={this.onRadioChange} value={radioValue}>
            <Radio.Button value="all">全部渠道</Radio.Button>
            <Radio.Button value="line">线上</Radio.Button>
            <Radio.Button value="shop">门店</Radio.Button>
          </Radio.Group>
        }
      >
        <Chart
          data={data}
          height={500}
          autoFit
          onIntervalClick={this.IntervalClick}
        >
          <Coordinate type="theta" radius={0.8} innerRadius={0.75} />
          <Axis visible={false} />
          <Tooltip
            showTitle={false}
            itemTpl={
              // 鼠标移入元素中显示内容～
              "<li style='height: 20px;' data-index={index} >" +
              '<span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>' +
              "{name}: ¥ {value}" +
              "</li>"
            }
          />
          <Interval
            adjust="stack"
            position="value"
            color="type"
            shape="sliceShape"
          />
          <Annotation.Text
            position={["50%", "45%"]}
            content="销售量"
            style={{
              lineHeight: "240px",
              fontSize: "30",
              fill: "#262626",
              textAlign: "center",
            }}
          />
          <Annotation.Text
            position={["50%", "55%"]}
            content={total}
            style={{
              lineHeight: "240px",
              fontSize: "30",
              fill: "#262626",
              textAlign: "center",
            }}
          />
          <Interaction type="element-single-selected" />
          <Legend position="right" />
        </Chart>
      </Card>
    );
  }
}
