import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Routing {
    interface IRouterOptions {
      serviceUrl?: string;
      timeout?: number;
    }

    class OSRMv1 {
      constructor(options?: IRouterOptions);
    }

    interface RoutingControlOptions extends L.ControlOptions {
      waypoints?: L.LatLng[];
      router?: any;
      routeWhileDragging?: boolean;
      addWaypoints?: boolean;
      draggableWaypoints?: boolean;
      fitSelectedRoutes?: boolean;
      showAlternatives?: boolean;
      lineOptions?: {
        styles?: { color: string; weight: number }[];
      };
      createMarker?: () => any;
    }

    class Control extends L.Control {
      constructor(options?: RoutingControlOptions);
      getWaypoints(): L.LatLng[];
      setWaypoints(waypoints: L.LatLng[]): void;
      route(): void;
      on(type: string, fn: (...args: any[]) => void, context?: any): this;
    }

    function control(options?: RoutingControlOptions): Control;
    function osrmv1(options?: IRouterOptions): OSRMv1;
  }
}
