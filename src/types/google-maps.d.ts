
// Type definitions for Google Maps JavaScript API 3.45
declare interface Window {
  google: typeof google;
}

declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element, opts?: MapOptions);
    panTo(latLng: LatLng | LatLngLiteral): void;
    setCenter(latLng: LatLng | LatLngLiteral): void;
    getCenter(): LatLng;
    setZoom(zoom: number): void;
    getZoom(): number;
    addListener(eventName: string, handler: (...args: any[]) => void): MapsEventListener;
    setOptions(options: MapOptions): void;
    setMapTypeId(mapTypeId: string): void;
    setTilt(tiltAngle: number): void;
    setHeading(heading: number): void;
    setStyle(styles: any[]): void;
    setFog(options: any): void;
    addControl(control: MVCObject, position?: ControlPosition): void;
    controls: MVCArrays<MVCArray<Node>>[];
    data: Data;
    mapTypes: MapTypeRegistry;
    overlayMapTypes: MVCArray<MapType>;
    padding: any;
    projection?: Projection;
    streetView?: StreetViewPanorama;
    zoom?: number;
    remove(): void;
    scrollZoom: {
      enable(): void;
      disable(): void;
    };
    easeTo(options: {center?: LatLng | LatLngLiteral, duration?: number, easing?: (n: number) => number}): void;
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    disableDefaultUI?: boolean;
    scrollwheel?: boolean;
    draggable?: boolean;
    mapTypeId?: string;
    styles?: any[];
    projection?: string;
    fullscreenControl?: boolean;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    zoomControl?: boolean;
    rotateControl?: boolean;
    scaleControl?: boolean;
    clickableIcons?: boolean;
    gestureHandling?: string;
    restriction?: any;
    tilt?: number;
    heading?: number;
  }

  interface LatLng {
    lat(): number;
    lng(): number;
    toJSON(): LatLngLiteral;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  class Marker {
    constructor(opts?: MarkerOptions);
    setPosition(latLng: LatLng | LatLngLiteral): void;
    setMap(map: Map | null): void;
    addListener(eventName: string, handler: (...args: any[]) => void): MapsEventListener;
    setIcon(icon: string | Icon | Symbol): void;
    getPosition(): LatLng;
    setTitle(title: string): void;
    setLabel(label: string | MarkerLabel): void;
    setDraggable(draggable: boolean): void;
    setVisible(visible: boolean): void;
    setZIndex(zIndex: number): void;
    getMap(): Map | null;
  }

  interface MarkerOptions {
    position: LatLng | LatLngLiteral;
    map?: Map;
    title?: string;
    icon?: string | Icon | Symbol;
    label?: string | MarkerLabel;
    draggable?: boolean;
    clickable?: boolean;
    animation?: any;
    zIndex?: number;
    opacity?: number;
    visible?: boolean;
  }

  interface Icon {
    url?: string;
    size?: Size;
    origin?: Point;
    anchor?: Point;
    scaledSize?: Size;
    labelOrigin?: Point;
    path?: string;
    fillColor?: string;
    fillOpacity?: number;
    scale?: number;
    strokeColor?: string;
    strokeWeight?: number;
  }

  interface Symbol {
    path: string | SymbolPath;
    anchor?: Point;
    fillColor?: string;
    fillOpacity?: number;
    labelOrigin?: Point;
    rotation?: number;
    scale?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
  }

  enum SymbolPath {
    BACKWARD_CLOSED_ARROW,
    BACKWARD_OPEN_ARROW,
    CIRCLE,
    FORWARD_CLOSED_ARROW,
    FORWARD_OPEN_ARROW
  }

  interface MarkerLabel {
    text: string;
    color?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
  }

  class Size {
    constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
    width: number;
    height: number;
    equals(other: Size): boolean;
  }

  class Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
    equals(other: Point): boolean;
  }

  class MapsEventListener {
    remove(): void;
  }

  class MVCObject {
    addListener(eventName: string, handler: (...args: any[]) => void): MapsEventListener;
    bindTo(key: string, target: MVCObject, targetKey?: string, noNotify?: boolean): void;
    changed(key: string): void;
    get(key: string): any;
    notify(key: string): void;
    set(key: string, value: any): void;
    setValues(values: any): void;
    unbind(key: string): void;
    unbindAll(): void;
  }

  class MVCArray<T> {
    constructor(array?: T[]);
    clear(): void;
    forEach(callback: (elem: T, i: number) => void): void;
    getArray(): T[];
    getAt(i: number): T;
    getLength(): number;
    insertAt(i: number, elem: T): void;
    pop(): T;
    push(elem: T): number;
    removeAt(i: number): T;
    setAt(i: number, elem: T): void;
  }

  type MVCArrays<T> = MVCArray<T>;

  class NavigationControl extends MVCObject {
    constructor(opts?: {visualizePitch?: boolean});
  }

  enum ControlPosition {
    BOTTOM_CENTER,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
    LEFT_BOTTOM,
    LEFT_CENTER,
    LEFT_TOP,
    RIGHT_BOTTOM,
    RIGHT_CENTER,
    RIGHT_TOP,
    TOP_CENTER,
    TOP_LEFT,
    TOP_RIGHT
  }

  class MapTypeRegistry extends MVCObject {
    set(id: string, mapType: MapType): void;
  }

  interface MapType {
    tileSize: Size;
    maxZoom: number;
    minZoom?: number;
    name?: string;
    alt?: string;
    getTile(tileCoord: Point, zoom: number, ownerDocument: Document): Element;
    releaseTile(tile: Element): void;
  }

  class Projection {
    fromLatLngToPoint(latLng: LatLng, point?: Point): Point;
    fromPointToLatLng(pixel: Point, noWrap?: boolean): LatLng;
  }

  class Data {
    add(feature: Data.Feature | Data.FeatureOptions): Data.Feature;
    addGeoJson(geoJson: object, options?: Data.GeoJsonOptions): Data.Feature[];
    contains(feature: Data.Feature): boolean;
    forEach(callback: (feature: Data.Feature) => void): void;
    getFeatureById(id: number | string): Data.Feature;
    remove(feature: Data.Feature): void;
    setControls(controls: string[][]): void;
    setControlPosition(controlPosition: ControlPosition): void;
    setControls(controls: string[][]): void;
    setDrawingMode(drawingMode: string | null): void;
    setMap(map: Map | null): void;
    setStyle(style: Data.StylingFunction | Data.StyleOptions): void;
    toGeoJson(callback: (feature: object) => void): void;
    loadGeoJson(url: string, options?: Data.GeoJsonOptions, callback?: (features: Data.Feature[]) => void): void;
    overrideStyle(feature: Data.Feature, style: Data.StyleOptions): void;
    revertStyle(feature?: Data.Feature): void;
    features: Data.Feature[];
  }

  namespace Data {
    interface Feature {
      getGeometry(): Data.Geometry;
      getProperty(name: string): any;
      getId(): number | string;
      setGeometry(newGeometry: Data.Geometry | LatLng | LatLngLiteral): void;
      setProperty(name: string, newValue: any): void;
      toGeoJson(callback: (feature: object) => void): void;
      getVisible(): boolean;
      setVisible(visible: boolean): void;
    }

    interface FeatureOptions {
      geometry?: Geometry | LatLng | LatLngLiteral;
      id?: number | string;
      properties?: object;
    }

    interface StyleOptions {
      clickable?: boolean;
      cursor?: string;
      draggable?: boolean;
      editable?: boolean;
      fillColor?: string;
      fillOpacity?: number;
      icon?: string | Icon | Symbol;
      shape?: any;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      title?: string;
      visible?: boolean;
      zIndex?: number;
    }

    type StylingFunction = (feature: Data.Feature) => Data.StyleOptions;

    interface GeoJsonOptions {
      idPropertyName?: string;
    }

    interface Geometry {
      getType(): string;
      forEachLatLng(callback: (latLng: LatLng) => void): void;
    }

    interface Point {
      get(): LatLng;
      type: string;
    }

    interface MultiPoint {
      getArray(): LatLng[];
      getAt(n: number): LatLng;
      getLength(): number;
      getType(): string;
    }

    interface LineString {
      getArray(): LatLng[];
      getAt(n: number): LatLng;
      getLength(): number;
      getType(): string;
    }

    interface MultiLineString {
      getArray(): Data.LineString[];
      getAt(n: number): Data.LineString;
      getLength(): number;
      getType(): string;
    }

    interface Polygon {
      getArray(): Data.LinearRing[];
      getAt(n: number): Data.LinearRing;
      getLength(): number;
      getType(): string;
    }

    interface MultiPolygon {
      getArray(): Data.Polygon[];
      getAt(n: number): Data.Polygon;
      getLength(): number;
      getType(): string;
    }

    interface LinearRing {
      getArray(): LatLng[];
      getAt(n: number): LatLng;
      getLength(): number;
      getType(): string;
    }

    interface GeometryCollection {
      getArray(): Data.Geometry[];
      getAt(n: number): Data.Geometry;
      getLength(): number;
      getType(): string;
    }
  }

  interface StreetViewPanorama {
    position: LatLng | LatLngLiteral;
    pov: StreetViewPov;
    visible: boolean;
  }

  interface StreetViewPov {
    heading: number;
    pitch: number;
  }
}
