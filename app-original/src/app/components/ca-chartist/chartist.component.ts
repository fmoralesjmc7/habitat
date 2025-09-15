import {
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
  } from '@angular/core';
  
  import * as Chartist from 'chartist';
  import { Subscription } from 'rxjs';
  
  /**
   * Possible chart types
   * @type {String}
   */
  export type ChartType = 'Pie' | 'Bar' | 'Line';
  
  export type ChartInterfaces =
    | Chartist.IChartistPieChart
    | Chartist.IChartistBarChart
    | Chartist.IChartistLineChart;
  export type ChartOptions =
    | Chartist.IBarChartOptions
    | Chartist.ILineChartOptions
    | Chartist.IPieChartOptions;
  export type ResponsiveOptionTuple = Chartist.IResponsiveOptionTuple<
    ChartOptions
  >;
  export type ResponsiveOptions = ResponsiveOptionTuple[];
  
  /**
   * Represent a chart event.
   * For possible values, check the Chartist docs.
   */
  export interface ChartEvent {
    [eventName: string]: (data: any) => void;
  }
  
  export const POINT_ANIMATION = 'width-pulse 3s ease infinite';
  export const BLACK_COLOR = 'rgb(67, 67, 67)';
  export const GREY_COLOR = 'rgba(0, 0, 0, 0.4)';

  @Component({
    selector: 'x-chartist',
    template: '<ng-content></ng-content>',
  })
  export class ChartistComponent implements OnInit, OnChanges, OnDestroy {
    didEnterSubscription: Subscription;
  
    @Input()
    // @ts-ignore
    public data: Promise<Chartist.IChartistData> | Chartist.IChartistData;
  
    // @ts-ignore
    @Input() public type: Promise<ChartType> | ChartType;
  
    @Input()
    // @ts-ignore
    public options: Promise<ChartOptions> | ChartOptions;
  
    @Input()
    // @ts-ignore
    public defaultOptions: ChartOptions = {
      axisX: {
        showGrid: false,
        offset: 70,
      },
      axisY: {
        showGrid: false,
        showLabel: false,
        offset: 0,
      },
      chartPadding: {
        left: 30,
        right: 50,
      },
      lineSmooth: false,
      fullWidth: true,
    };
  
    @Input()
    // @ts-ignore
    public responsiveOptions: Promise<ResponsiveOptions> | ResponsiveOptions;
  
    // @ts-ignore
    @Input() public events: ChartEvent;
  
    // @ts-ignore
    public chart: ChartInterfaces;
  
    private element: HTMLElement;
  
    constructor(
      element: ElementRef,
    ) {
      this.element = element.nativeElement;
    }
  
    public ngOnInit(): Promise<ChartInterfaces> {
      if (!this.type || !this.data) {
        return Promise.reject('Expected at least type and data.');
      }
  
      return this.renderChart().then((chart) => {
        if (this.events !== undefined) {
          this.bindEvents(chart);
        }
        return chart;
      });
    }
  
    public ngOnChanges(changes: SimpleChanges): void {
      this.update(changes);
    }
  
    public ngOnDestroy(): void {
      if (this.chart) {
        this.chart.detach();
      }
      if (this.didEnterSubscription) {
        this.didEnterSubscription.unsubscribe();
      }
    }
  
    public renderChart(): Promise<ChartInterfaces> {
      const promises: Array<any> = [
        this.type,
        this.element,
        this.data,
        this.options,
        this.responsiveOptions,
      ];
  
      return Promise.all(promises).then((values) => {
        let [type, element, data, options, responsiveOptions] = values;
  
        if (data && 'series' in data && data.series.length && !Array.isArray(data.series[0])) {
          const series = data.series as Array<{ name: string, data: Array<number> }>;
  
          const originalSeries = series.filter(serie => !serie.name.endsWith('hidden'));
  
          series.length = 0;
          series.push(...originalSeries);
        }
  
        // @ts-ignore
        options = { ...this.defaultOptions, ...options };
  
        if (!(type in Chartist)) {
          throw new Error(`${type} is not a valid chart type`);
        }
  
        this.options = options;
        this.chart = (Chartist as any)[type](element, data, options, responsiveOptions);
  
        return this.chart;
      });
    }
  
    public update(changes: SimpleChanges): void {
  
      if (!this.chart || 'type' in changes) {
        this.renderChart();
        return;
      }
      if (changes.data) {
        this.data = changes.data.currentValue;
      }
  
      if (changes.options) {
        this.options = changes.options.currentValue;
      }
  
      (this.chart as any).update(this.data, this.options);
    }
  
    public bindEvents(chart: any): void {
      for (const event of Object.keys(this.events)) {
        chart.on(event, this.events[event]);
      }
    }
  }
  
  // https://gitlab.influitive.io/beaulne/chartist-plugin-tooltip-nojQuery
  const defaultOptions = {
    className: 'ct-tooltip',
    translation: () => ({ left: 0, top: 0 }),
  };
  
  Object.assign(Chartist, { plugins: [] });
  
  Chartist.plugins.tooltip = function (options) {
  
    options = Chartist.extend({}, defaultOptions, options);
  
    function addChartAnimationToClosestPeriod(chartPoints, period) {
      chartPoints.forEach(point => {
        point.style.animation = 'none';
        if (Number(point.getAttribute('x1')) === period) { point.style.animation = POINT_ANIMATION; }
      });
    }
  
    function clickedOutsideChart(event, element) {
      const delta = 25;
      const labelsClicked = String(event.target.className).includes('ct-label');
      return labelsClicked || event.clientY > element.getBoundingClientRect().bottom - delta;
    }
  
    function formatBalance(balance) {
      const parsed = parseInt(balance);
      return isNaN(parsed) ? '' : '$' + new Intl.NumberFormat('es-CL').format(parsed);
    }
  
    function getClosestPeriod(clientX, chartPoints, chartElement) {
      const chartXAxisOrigin = (chartElement.getBoundingClientRect() as DOMRect).x;
      const xAxisPoints = getXAxisPoints(chartPoints);
  
      return xAxisPoints.reduce((previous, current) => {
        const delta = chartXAxisOrigin - clientX;
        return getClosestPoint(current, previous, delta);
      });
    }
  
    function getClosestPoint(current, previous, delta) {
      return (Math.abs(current + delta) < Math.abs(previous + delta) ? current : previous);
    }
  
    function getMouse(event, toolTip, chartMaxWidth) {
      const { left, top } = options.translation();
  
      const leftPosition = Math.max(0, left + event.layerX + toolTip.clientWidth / 2);
  
      if (chartMaxWidth < leftPosition) {
        toolTip.style.left = 'unset';
        toolTip.style.right = Math.min(0, toolTip.clientWidth / 2) + 'px';
      } else {
        toolTip.style.right = 'unset';
        toolTip.style.left = Math.max(0, left + event.layerX - toolTip.clientWidth / 2) + 'px';
      }
  
      toolTip.style.top = top + event.layerY - toolTip.clientHeight + 'px';
  
      return toolTip;
    }
  
    function getToolTipData(chartPoints, period) {
      let data = '';
  
      chartPoints.forEach(point => {
        const accountType = point.parentElement.getAttribute('ct:series-name');
        const accountBalance = formatBalance(point.getAttribute('ct:value'));
  
        if (Number(point.getAttribute('x1')) === period) {
          data += `<label class="${accountType} ct-type">${accountBalance}</label><br>`;
        }
      });
  
      return data;
    }
  
    function getXAxisPoints(chartPoints) {
      return chartPoints.map(element => {
        return Number(element.getAttribute('x1'));
      });
    }
  
    function isToolTipClicked(event: HTMLElement) {
      return event.className === 'ct-tooltip' || event.parentElement!.className === 'ct-tooltip';
    }
  
    function removePulseAnimations(chartPoints) {
      chartPoints.forEach(point => {
        point.style.animation = 'none';
      });
    }
  
    function setPeriodLabelColor(chartElement, closestPeriod) {
      const labelElements = Array.from(chartElement.getElementsByTagName('foreignObject'));
  
      labelElements.forEach((element: SVGForeignObjectElement) => {
        const label = element.querySelectorAll('.ct-label')[0] as HTMLElement;
        label.style.color = GREY_COLOR;
  
        if (element.x.animVal.value.toFixed(0) === closestPeriod.toFixed(0)) {
          label.style.color = BLACK_COLOR;
        }
      });
    }
  
    function setToolTip(toolTip, chartPoints, closestPeriod, event, chartMaxWidth) {
      toolTip.innerHTML = getToolTipData(chartPoints, closestPeriod);
      toolTip.style.display = 'block';
      toolTip.style.backgroundColor = 'white';
  
      toolTip = getMouse(event, toolTip, chartMaxWidth);
  
      return toolTip;
    }
  
    return function tooltip({ container }) {
      const chart = container;
      chart.innerHTML = '<div class="' + options.className + '"></div>';
  
      let toolTip = chart.getElementsByClassName(options.className)[0] as HTMLElement;
  
      toolTip.style.display = 'none';
      toolTip.style.position = 'absolute';
  
      chart.addEventListener('click', function (event) {
        const chartElement = document.getElementById(chart.id);
        const chartParent = chartElement?.parentNode as HTMLElement;
        const chartMaxWidth = (chartElement as HTMLElement).getBoundingClientRect().width;
  
        const chartPoints = Array.from(chartElement!.getElementsByClassName('ct-point'));
  
        if (isToolTipClicked(event.target) || clickedOutsideChart(event, chartParent)) {
          toolTip.style.display = 'none';
          setPeriodLabelColor(chartElement, 0);
          removePulseAnimations(chartPoints);
          return;
        }
  
        if (!chartPoints.length) { return; }
  
        const closestPeriod = getClosestPeriod(event.clientX, chartPoints, chartElement);
  
        setPeriodLabelColor(chartElement, closestPeriod);
  
        toolTip = setToolTip(toolTip, chartPoints, closestPeriod, event, chartMaxWidth);
  
        addChartAnimationToClosestPeriod(chartPoints, closestPeriod);
      }, false);
    };
  };
  