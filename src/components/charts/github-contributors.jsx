import { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5themes_Dark from "@amcharts/amcharts5/themes/Dark";

const ChartComponent = (props) => {

    useEffect(() => {

        let root = am5.Root.new("chartdiv5");

        const isDarkMode = document.documentElement.classList.contains("dark");

        root.setThemes([am5themes_Animated.default.new(root)]);

        if (isDarkMode) {
        root.setThemes([am5themes_Dark.default.new(root)]);
        }

        let chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "none",
            wheelY: "none",
            paddingLeft: 0
        }));

        let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);

        let xRenderer = am5xy.AxisRendererX.new(root, { 
            minGridDistance: 30,
            minorGridEnabled: true
        });

        let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            maxDeviation: 0,
            categoryField: "name",
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(root, {})
        }));

        xRenderer.grid.template.set("visible", false);

        xRenderer.labels.template.set("visible", false);

        let yRenderer = am5xy.AxisRendererY.new(root, {});
        let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0,
            min: 0,
            extraMax: 0.1,
            renderer: yRenderer
        }));

        yRenderer.grid.template.setAll({
            strokeDasharray: [2, 2]
        });

        let series = chart.series.push(am5xy.ColumnSeries.new(root, {
            name: "Series 1",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            sequencedInterpolation: true,
            categoryXField: "name",
            tooltip: am5.Tooltip.new(root, { dy: -25, labelText: "{valueY}" })
        }));

        series.columns.template.setAll({
            cornerRadiusTL: 5,
            cornerRadiusTR: 5,
            strokeOpacity: 0
        });

        series.columns.template.adapters.add("fill", (fill, target) => {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

        series.columns.template.adapters.add("stroke", (stroke, target) => {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

        console.log(props.contributors);

        let data = [];

        if (props.contributors && props.contributors.length > 0) {
            data = props.contributors.map(contributor => ({
                name: contributor.login,
                value: contributor.contributions,
                bulletSettings: { src: contributor.avatar_url }
            }));
        }

        series.bullets.push(function() {
            return am5.Bullet.new(root, {
                locationY: 1,
                sprite: am5.Picture.new(root, {
                    templateField: "bulletSettings",
                    width: 50,
                    height: 50,
                    centerX: am5.p50,
                    centerY: am5.p50,
                    shadowColor: am5.color(0x000000),
                    shadowBlur: 4,
                    shadowOffsetX: 4,
                    shadowOffsetY: 4,
                    shadowOpacity: 0.6
                })
            });
        });

        xAxis.data.setAll(data);
        series.data.setAll(data);

        series.appear(1000);
        chart.appear(1000, 100);

        return () => {
            root.dispose();
        }

    }, [props.contributors]);

    return <div id="chartdiv5" style={{ width: "100%", height: "400px" }}></div>;
};

export default ChartComponent;
