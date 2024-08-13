"use client";

import { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5themes_Dark from "@amcharts/amcharts5/themes/Dark";

const ChartComponent = (props) => {
  useEffect(() => {

    let root = am5.Root.new("chartdiv");

    const isDarkMode = document.documentElement.classList.contains("dark");
    const gridColor = isDarkMode ? am5.color(0xffffff) : am5.color(0x000000);

    root.setThemes([am5themes_Animated.default.new(root)]);

    if (isDarkMode) {
      root.setThemes([am5themes_Dark.default.new(root)]);
    }

    root.interfaceColors.set("grid", gridColor);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        paddingLeft: 0
      })
    );

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineX.set("forceHidden", true);
    cursor.lineY.set("forceHidden", true);

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: {
          timeUnit: "day",
          count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {
          minorGridEnabled: true,
          minGridDistance: 90
        })
      })
    );

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    let series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}",
          labelColor: am5.color(0x000000),
        })
      })
    );

    const fillColor = isDarkMode ? am5.color(0x555555) : am5.color(0xaaaaaa);
    const backgroundColor = isDarkMode ? am5.color(0x333333) : am5.color(0xffffff);
    const strokeColor = isDarkMode ? am5.color(0xaaaaaa) : am5.color(0x000000);

    series.fills.template.setAll({
      fill: fillColor,
      fillOpacity: 0.2,
      visible: true
    });

    let rangeDataItem = yAxis.makeDataItem({});
    yAxis.createAxisRange(rangeDataItem);

    let container = am5.Container.new(root, {
      centerY: am5.p50,
      draggable: true,
      layout: root.horizontalLayout
    });

    container.adapters.add("x", function() {
      return 0;
    });

    container.adapters.add("y", function(y) {
      return Math.max(0, Math.min(chart.plotContainer.height(), y));
    });

    container.events.on("dragged", function() {
      updateLabel();
    });

    yAxis.topGridContainer.children.push(container);

    rangeDataItem.set("bullet", am5xy.AxisBullet.new(root, {
      sprite: container
    }));

    rangeDataItem.get("grid").setAll({
      strokeOpacity: 1,
      visible: true,
      stroke: strokeColor,
      strokeDasharray: [2, 2]
    });

    let background = am5.RoundedRectangle.new(root, {
      fill: backgroundColor,
      fillOpacity: 1,
      strokeOpacity: 0.5,
      cornerRadiusTL: 0,
      cornerRadiusBL: 0,
      cursorOverStyle: "ns-resize",
      stroke: strokeColor
    });

    container.set("background", background);

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const data = props.data
      .map(item => ({
        date: new Date(item.date).getTime(),
        value: item.count
      }))
      .filter(item => item.date >= oneYearAgo.getTime());

    series.data.setAll(data);

    series.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [props.data]);

  return <div id="chartdiv" style={{ width: "100%", height: "300px" }}></div>;
};

export default ChartComponent;