"use client";

import { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5themes_Dark from "@amcharts/amcharts5/themes/Dark";

const ChartComponent = (props) => {

  console.log(props.data)

  useEffect(() => {

    let root = am5.Root.new("chartdiv3");

    const isDarkMode = document.documentElement.classList.contains("dark");

    root.setThemes([am5themes_Animated.default.new(root)]);

    if (isDarkMode) {
      root.setThemes([am5themes_Dark.default.new(root)]);
    }

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        startAngle: 160,
        endAngle: 380
      })
    );

    let series0 = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "space",
        categoryField: "dataSize",
        startAngle: 160,
        endAngle: 380,
        radius: am5.percent(70),
        innerRadius: am5.percent(65)
      })
    );

    let colorSet = am5.ColorSet.new(root, {
      colors: [series0.get("colors").getIndex(1)],
      passOptions: {
        lightness: -0.05,
        hue: 0
      }
    });

    series0.set("colors", colorSet);
    series0.ticks.template.set("forceHidden", true);
    series0.labels.template.set("forceHidden", true);

    let series1 = chart.series.push(
      am5percent.PieSeries.new(root, {
        startAngle: 160,
        endAngle: 380,
        valueField: "bottles",
        innerRadius: am5.percent(80),
        categoryField: "dataSize"
      })
    );

    series1.ticks.template.set("forceHidden", true);
    series1.labels.template.set("forceHidden", true);

    let label = chart.seriesContainer.children.push(
      am5.Label.new(root, {
        textAlign: "center",
        centerY: am5.p100,
        centerX: am5.p50,
        text: "[fontSize:18px]total[/]:\n[bold fontSize:20px]976562499[/]"
      })
    );

    let data = [
      { dataSize: "Space", space: props.data.space, bottles: props.data.space },
      { dataSize: "Used", space: 1000000000 - props.data.space, bottles: 1000000000 - props.data.space },
    ];

    series0.data.setAll(data);
    series1.data.setAll(data);

    return () => {
      root.dispose();
    };
  }, []);

  return <div id="chartdiv3" style={{ width: "20vw", height: "220px" }}></div>;
};

export default ChartComponent;
