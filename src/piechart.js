import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import React, { Component } from 'react';

class PieChart extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.root = am5.Root.new(this.props.rootName);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.dataPoints !== this.props.dataPoints &&
      this.props.dataPoints.length > 0
    ) {
      let subCategoryData = [];
      for (let i = 0; i < this.props.subSeriesLength; i++) {
        subCategoryData.push({ category: '', value: 0 });
      }

      let root = this.root;
      // this.root = am5.Root.new("piechartdiv");
      // Set themes
      root.setThemes([am5themes_Animated.new(root)]);
      let container = root.container.children.push(
        am5.Container.new(root, {
          width: am5.p100,
          height: am5.p100,
          layout: root.horizontalLayout,
        }),
      );
      // Create main chart
      let chart = container.children.push(
        am5percent.PieChart.new(root, {
          radius: am5.percent(70),
          tooltip: am5.Tooltip.new(root, {}),
        }),
      );
      // Create series
      let series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: 'value',
          categoryField: 'category',
          alignLabels: false,
        }),
      );
      series.labels.template.setAll({
        // textType: "circular",
        // radius: 4,
        maxWidth: 100,
        fontSize: 12,
        oversizedBehavior: 'wrap',
        //text: "{category}\n [{color}, bold]{sign} {valuePercentTotal.formatNumber('0.00')}%[/] \n [{color}, bold]{diff} counts[/]",
      });
      // series.ticks.template.set("visible", false);
      series.slices.template.set('toggleKey', 'none');
      // add events
      series.slices.template.events.on('click', function (e) {
        selectSlice(e.target);
      });
      // Create sub chart
      let subChart = container.children.push(
        am5percent.PieChart.new(root, {
          radius: am5.percent(50),
          tooltip: am5.Tooltip.new(root, {}),
        }),
      );
      // Create sub series
      let subSeries = subChart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: 'value',
          categoryField: 'category',
        }),
      );

      subSeries.data.setAll(subCategoryData);
      subSeries.labels.template.set('visible', false);
      subSeries.ticks.template.set('visible', false);
      subSeries.slices.template.set('toggleKey', 'none');
      let selectedSlice;
      series.on('startAngle', function () {
        updateLines();
      });
      container.events.on('boundschanged', function () {
        root.events.on('frameended', function () {
          updateLines();
        });
      });
      function updateLines() {
        if (selectedSlice) {
          let startAngle = selectedSlice.get('startAngle');
          let arc = selectedSlice.get('arc');
          let radius = selectedSlice.get('radius');
          let x00 = radius * am5.math.cos(startAngle);
          let y00 = radius * am5.math.sin(startAngle);
          let x10 = radius * am5.math.cos(startAngle + arc);
          let y10 = radius * am5.math.sin(startAngle + arc);
          let subRadius = subSeries.slices.getIndex(0).get('radius');
          let x01 = 0;
          let y01 = -subRadius;
          let x11 = 0;
          let y11 = subRadius;
          let point00 = series.toGlobal({ x: x00, y: y00 });
          let point10 = series.toGlobal({ x: x10, y: y10 });
          let point01 = subSeries.toGlobal({ x: x01, y: y01 });
          let point11 = subSeries.toGlobal({ x: x11, y: y11 });
          line0.set('points', [point00, point01]);
          line1.set('points', [point10, point11]);
        }
      }
      // lines
      let line0 = container.children.push(
        am5.Line.new(root, {
          position: 'absolute',
          stroke: root.interfaceColors.get('text'),
          strokeDasharray: [2, 2],
        }),
      );
      let line1 = container.children.push(
        am5.Line.new(root, {
          position: 'absolute',
          stroke: root.interfaceColors.get('text'),
          strokeDasharray: [2, 2],
        }),
      );
      // Set data
      // series.data.setAll(TESTDATASET);
      series.data.setAll(this.props.dataPoints);

      function selectSlice(slice) {
        selectedSlice = slice;
        let dataItem = slice.dataItem;
        let dataContext = dataItem.dataContext;
        if (dataContext) {
          let i = 0;
          subSeries.data.each(function (dataObject) {
            subSeries.data.setIndex(i, dataContext.subData[i]);
            i++;
          });
        }
        let middleAngle = slice.get('startAngle') + slice.get('arc') / 2;
        let firstAngle = series.dataItems[0].get('slice').get('startAngle');
        series.animate({
          key: 'startAngle',
          to: firstAngle - middleAngle,
          duration: 1000,
          easing: am5.ease.out(am5.ease.cubic),
        });
        series.animate({
          key: 'endAngle',
          to: firstAngle - middleAngle + 360,
          duration: 1000,
          easing: am5.ease.out(am5.ease.cubic),
        });
      }

      container.appear(1000, 10);

      let tooltip = am5.Tooltip.new(root, {
        getFillFromSprite: false,
        autoTextColor: false,
      });

      tooltip.get('background').setAll({
        fill: am5.color(0xffffff),
        fillOpacity: 1,
        shadowColor: am5.color(0x000000),
        shadowBlur: 10,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        shadowOpacity: 0.3,
      });

      tooltip.label.setAll({
        fill: am5.color(0x000000),
      });

      series.set('tooltip', tooltip);
      subSeries.set('tooltip', tooltip);

      series.events.on('datavalidated', function () {
        selectSlice(series.slices.getIndex(0));
      });
    }
  }

  componentWillUnmount() {
    if (this.root) {
      this.root.dispose();
    }
  }

  render() {
    return (
      <div
        id={this.props.rootName}
        style={{ width: '100%', height: '500px' }}
      ></div>
    );
  }
}

export default PieChart;
