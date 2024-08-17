import { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5themes_Dark from "@amcharts/amcharts5/themes/Dark";

const ChartComponent = (props) => {
    useEffect(() => {
        if (!props.commits || props.commits.length === 0) {
            return;
        }

        let root = am5.Root.new("chartdiv4");

        const isDarkMode = document.documentElement.classList.contains("dark");

        root.setThemes([am5themes_Animated.default.new(root)]);
        if (isDarkMode) {
            root.setThemes([am5themes_Dark.default.new(root)]);
        }

        let chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            pinchZoomX: true,
            paddingLeft: 0
        }));

        let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "none",
            lineX: am5.Line.new(root, { visible: true, strokeDasharray: [3, 3] }),
            lineY: am5.Line.new(root, { visible: true, strokeDasharray: [3, 3] })
        }));

        cursor.lineY.set("visible", true);  // Affiche la ligne horizontale
        cursor.lineX.set("visible", true);  // Affiche la ligne verticale

        // Regrouper les commits par date
        const commitsByDate = {};
        props.commits.forEach(commit => {
            const date = new Date(commit.commit.author.date);
            const dateString = date.toISOString().split('T')[0]; // Format 'YYYY-MM-DD'
            if (!commitsByDate[dateString]) {
                commitsByDate[dateString] = 0;
            }
            commitsByDate[dateString]++;
        });

        // Créer les données pour le graphique
        const data = Object.keys(commitsByDate).map(date => ({
            date: new Date(date).getTime(),
            value: commitsByDate[date]
        }));

        let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
            baseInterval: { timeUnit: "day", count: 1 },
            renderer: am5xy.AxisRendererX.new(root, {
                minorGridEnabled: true
            }),
            tooltip: am5.Tooltip.new(root, {})
        }));

        let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {
                minGridDistance: 40
            })
        }));

        let series = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Series",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "date",
            tooltip: am5.Tooltip.new(root, {
                labelText: "{valueY} commits"
            })
        }));

        let scrollbar = chart.set("scrollbarX", am5xy.XYChartScrollbar.new(root, {
            orientation: "horizontal",
            height: 60
        }));

        let sbDateAxis = scrollbar.chart.xAxes.push(am5xy.DateAxis.new(root, {
            baseInterval: { timeUnit: "day", count: 1 },
            renderer: am5xy.AxisRendererX.new(root, {
                minorGridEnabled: true,
                minGridDistance: 70
            })
        }));

        let sbValueAxis = scrollbar.chart.yAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {
                minGridDistance: 40
            })
        }));

        let sbSeries = scrollbar.chart.series.push(am5xy.LineSeries.new(root, {
            valueYField: "value",
            valueXField: "date",
            xAxis: sbDateAxis,
            yAxis: sbValueAxis
        }));

        // Remplacer les données en dur par les données des commits
        series.data.setAll(data);
        sbSeries.data.setAll(data);

        function createAxisRange(axis, startDate, endDate, chart) {
            let dataItem = axis.makeDataItem({});
            dataItem.set("value", startDate.getTime());
            dataItem.set("endValue", endDate.getTime());

            let range = axis.createAxisRange(dataItem);
            range.get("axisFill").setAll({
                fill: chart.get("colors").getIndex(7),
                fillOpacity: 0.4,
                visible: true
            });
            range.get("grid").set("forceHidden", true);
        }

        createAxisRange(xAxis, new Date(2023, 4, 10), new Date(2023, 4, 11), chart);
        createAxisRange(xAxis, new Date(2023, 4, 19), new Date(2023, 4, 20), chart);

        series.appear(1000);
        chart.appear(1000, 100);

        return () => {
            root.dispose();
        };
    }, [props.commits]);

    return <div id="chartdiv4" style={{ width: "100%", height: "400px" }}></div>;
}

export default ChartComponent;
