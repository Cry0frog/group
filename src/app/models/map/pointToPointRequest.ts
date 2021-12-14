import { MapPoint } from './mapPoint';

export class PointToPointRequest {
    startPoint: MapPoint;
    endPoint: MapPoint;
    intermediate: [];

    public static build(start: number[], end: number[], intermediate: any[]): PointToPointRequest {
        return {
            startPoint: {
                lon: start[0],
                lat: start[1]
            },
            endPoint: {
                lon: end[0],
                lat: end[1],
            },
            intermediate: intermediate
        } as PointToPointRequest;
    }
}
