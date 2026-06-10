const assumptions = {
  streamingPayout: {
    low: 0.002,
    typical: 0.003,
    high: 0.005
  }
};

const scenarios = {
  freelance: { streams: 5000, shows: 0, netPerShow: 0, dayRate: 300, freelanceDays: 10, target: 1800 },
  live:      { streams: 20000, shows: 4, netPerShow: 200, dayRate: 200, freelanceDays: 3, target: 1500 },
  streaming: { streams: 50000, shows: 1, netPerShow: 100, dayRate: 0, freelanceDays: 0, target: 1500 }
};