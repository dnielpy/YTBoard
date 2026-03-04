export type AccountName = "Youtube";

export type ViewsStats = {
  total: number;
  perMonth: {
    month: string;
    views: number;
  }[];
  perVideo: {
    videoID: string;
    views: number;
  };
};

export type FollowerStats = {
  total: number;
  perMonth: {
    month: string;
    views: number;
  }[];
  perVideo: {
    videoID: string;
    views: number;
  };
};

export type EarningStats = {
  total: number;
  perMonth: {
    month: string;
    views: number;
  }[];
  perVideo: {
    videoID: string;
    views: number;
  };
};

export type Stats = {
  viewStats: ViewsStats;
  followerStat: FollowerStats;
  earningStat: EarningStats;
};

export type Account = {
  name: AccountName;
  userName: string;
  stats: Stats;
};
