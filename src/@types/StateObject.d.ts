export interface StateObject {
  id: string;
  state_name: string;
  status: string;
}

export interface DistrictObject {
  id: string;
  state_id: string;
  district_name: string;
  status: string;
}

export interface ConstituencyObject {
  id: string;
  state_id: string;
  district_id: string;
  constituency_name: string;
  status: string;
}
