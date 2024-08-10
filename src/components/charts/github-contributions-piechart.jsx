"use client";

import { useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import { useSession } from "next-auth/react";

const ChartComponent = (props) => {

  useEffect(() => {

    let root = am5.Root.new("chartdiv2");

    const isDarkMode = document.documentElement.classList.contains("dark");

    
    root.setThemes([am5themes_Animated.default.new(root)]);

    if (isDarkMode) {
      root.setThemes([am5themes_Dark.default.new(root)]);
    }
  
    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        endAngle: 270
      })
    );

    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        endAngle: 270
      })
    );

    series.states.create("hidden", {
      endAngle: -90
    });

    series.labels.template.setAll({
      text: "{category}: {value}",
      fill: isDarkMode ? am5.color(0xffffff) : am5.color(0x000000),
      fontSize: 14
    });

    const transformedData = Object.keys(props.data).map(year => ({
      category: year,
      value: props.data[year]
    }));

    series.data.setAll([
      ...transformedData
    ]);

    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [props.data]);

  return <div id="chartdiv2" style={{ width: "40vw", height: "300px" }}></div>;
};

export default ChartComponent;