window.PRICE_DATA = {
  metadata: {
    lastUpdated: "2026-03-30",
    updateTime: "10:00 AM Beijing Time",
    sources: {
      aliyun: "https://help.aliyun.com/help/json/document_detail.json?nodeId=2840914",
      bytedance: "https://www.volcengine.com/docs/82379/1544106"
    }
  },
  current: {
    aliyun: {
      language: [
        {
          name: "qwen3-max",
          displayName: "Flagship",
          level: "Flagship",
          desc: "最高能力，复杂推理",
          tiers: [
            { range: "0-32K", input: 2.5, output: 10.0 },
            { range: "32K-128K", input: 4.0, output: 16.0 },
            { range: "128K-252K", input: 7.0, output: 28.0 }
          ]
        },
        {
          name: "qwen3.5-plus",
          displayName: "Pro",
          level: "Pro",
          desc: "性能与成本平衡",
          tiers: [
            { range: "0-128K", input: 0.8, output: 4.8 },
            { range: "128K-256K", input: 2.0, output: 12.0 },
            { range: "256K-1M", input: 4.0, output: 24.0 }
          ]
        },
        {
          name: "qwen3.5-flash",
          displayName: "Flash",
          level: "Flash",
          desc: "极速响应",
          tiers: [
            { range: "0-128K", input: 0.2, output: 2.0 },
            { range: "128K-256K", input: 0.8, output: 8.0 },
            { range: "256K-1M", input: 1.2, output: 12.0 }
          ]
        }
      ],
      code: [
        {
          name: "qwen3-coder-plus",
          displayName: "Coder Pro",
          level: "Coder Pro",
          desc: "代码生成与补全",
          tiers: [
            { range: "0-32K", input: 4.0, output: 16.0 },
            { range: "32K-128K", input: 6.0, output: 24.0 },
            { range: "128K-256K", input: 10.0, output: 40.0 },
            { range: "256K-1M", input: 20.0, output: 200.0 }
          ]
        },
        {
          name: "qwen-coder-turbo",
          displayName: "Coder Lite",
          level: "Coder",
          desc: "快速代码生成",
          tiers: [
            { range: "无阶梯", input: 2.0, output: 6.0 }
          ]
        },
        {
          name: "qwq-32b",
          displayName: "Reasoning",
          level: "Reasoning",
          desc: "深度推理",
          tiers: [
            { range: "无阶梯", input: 1.6, output: 4.0 }
          ]
        }
      ],
      vision: [
        {
          name: "qwen-vl-max",
          displayName: "Vision Max",
          level: "Vision Max",
          desc: "高级图像理解",
          tiers: [
            { range: "无阶梯", input: 1.6, output: 4.0 }
          ]
        },
        {
          name: "qwen3-vl-plus",
          displayName: "Vision Plus",
          level: "Vision Plus",
          desc: "平衡视觉理解",
          tiers: [
            { range: "0-32K", input: 1.0, output: 10.0 },
            { range: "32K-128K", input: 1.5, output: 15.0 },
            { range: "128K-256K", input: 3.0, output: 30.0 }
          ]
        },
        {
          name: "qwen-omni",
          displayName: "Omni",
          level: "Omni",
          desc: "全模态理解",
          tiers: [
            { range: "0-128K", input: 1.8, output: 6.9 }
          ]
        },
        {
          name: "qvq-max",
          displayName: "Visual Reasoning",
          level: "Visual Reasoning",
          desc: "视觉推理分析",
          tiers: [
            { range: "0-128K", input: 8.0, output: 32.0 }
          ]
        }
      ],
      image: [
        {
          name: "qwen-image-2.0",
          price: 0.50,
          unit: "per_image"
        },
        {
          name: "wanxiang-2.1-t2i",
          price: 0.20,
          unit: "per_image"
        }
      ],
      video: [
        {
          name: "wanxiang-video",
          price: 0.50,
          unit: "per_video",
          notes: "按长度变化"
        }
      ]
    },
    bytedance: {
      language: [
        {
          name: "doubao-seed-2.0-pro",
          displayName: "Flagship",
          level: "Flagship",
          desc: "旗舰版，最强能力",
          tiers: [
            { range: "0-32K", input: 3.2, output: 16.0 },
            { range: "32K-128K", input: 4.8, output: 24.0 },
            { range: "128K-256K", input: 9.6, output: 48.0 }
          ]
        },
        {
          name: "doubao-seed-2.0-lite",
          displayName: "Pro",
          level: "Pro",
          desc: "高性能通用模型",
          tiers: [
            { range: "0-32K", input: 0.6, output: 3.6 },
            { range: "32K-128K", input: 0.9, output: 5.4 },
            { range: "128K-256K", input: 1.8, output: 10.8 }
          ]
        },
        {
          name: "doubao-seed-2.0-mini",
          displayName: "Flash",
          level: "Flash",
          desc: "轻量版，经济实惠",
          tiers: [
            { range: "0-32K", input: 0.2, output: 2.0 },
            { range: "32K-128K", input: 0.4, output: 4.0 },
            { range: "128K-256K", input: 0.8, output: 8.0 }
          ]
        },
        {
          name: "doubao-seed-1.6-flash",
          displayName: "Flash",
          level: "Flash",
          desc: "极速版，最低成本",
          tiers: [
            { range: "0-32K", input: 0.15, output: 1.5 },
            { range: "32K-128K", input: 0.3, output: 3.0 },
            { range: "128K-256K", input: 0.6, output: 6.0 }
          ]
        },
        {
          name: "doubao-1.5-pro-32k",
          displayName: "Pro 32K",
          level: "Pro",
          desc: "高性能长上下文",
          tiers: [
            { range: "无阶梯", input: 0.8, output: 2.0 }
          ]
        },
        {
          name: "doubao-1.5-lite-32k",
          displayName: "Lite 32K",
          level: "Lite",
          desc: "轻量长上下文",
          tiers: [
            { range: "无阶梯", input: 0.3, output: 0.6 }
          ]
        }
      ],
      code: [
        {
          name: "doubao-seed-2.0-code",
          displayName: "Coder Pro",
          level: "Coder Pro",
          desc: "代码生成与补全",
          tiers: [
            { range: "0-32K", input: 3.2, output: 16.0 },
            { range: "32K-128K", input: 4.8, output: 24.0 },
            { range: "128K-256K", input: 9.6, output: 48.0 }
          ]
        },
        {
          name: "doubao-seed-code",
          displayName: "Coder",
          level: "Coder",
          desc: "通用代码模型",
          tiers: [
            { range: "0-32K", input: 1.2, output: 8.0 },
            { range: "32K-128K", input: 1.4, output: 12.0 },
            { range: "128K-256K", input: 2.8, output: 16.0 }
          ]
        }
      ],
      vision: [
        {
          name: "doubao-1.5-vision-pro",
          displayName: "Vision Max",
          level: "Vision Max",
          desc: "专业视觉理解",
          tiers: [
            { range: "无阶梯", input: 3.0, output: 9.0 }
          ]
        },
        {
          name: "doubao-1.5-vision-lite",
          displayName: "Vision Lite",
          level: "Vision Lite",
          desc: "轻量视觉理解",
          tiers: [
            { range: "无阶梯", input: 1.5, output: 4.5 }
          ]
        },
        {
          name: "doubao-seed-1.6-vision",
          displayName: "Vision Plus",
          level: "Vision Plus",
          desc: "视觉理解",
          tiers: [
            { range: "0-32K", input: 0.8, output: 8.0 },
            { range: "32K-128K", input: 1.2, output: 16.0 },
            { range: "128K-256K", input: 2.4, output: 24.0 }
          ]
        }
      ],
      image: [
        {
          name: "doubao-image",
          price: 0.22,
          unit: "per_image",
          range: "0.15-0.30"
        }
      ],
      video: [
        {
          name: "doubao-seedance",
          price: 1.10,
          unit: "per_minute",
          range: "0.20-2.00"
        }
      ],
      audio: [
        {
          name: "doubao-asr",
          price: 2.70,
          unit: "per_hour",
          range: "0.80-4.60"
        }
      ]
    },
    thirdParty: [
      {
        name: "deepseek-v3",
        provider: "deepseek",
        desc: "推理与编码",
        aliyun: { input: 2.0, output: 8.0 },
        bytedance: { input: 2.0, output: 8.0 }
      },
      {
        name: "deepseek-r1",
        provider: "deepseek",
        desc: "深度推理",
        aliyun: { input: 4.0, output: 16.0 },
        bytedance: { input: 4.0, output: 16.0 }
      },
      {
        name: "kimi-k2",
        provider: "moonshot",
        desc: "长上下文",
        aliyun: { input: 4.0, output: 16.0 },
        bytedance: { input: 4.0, output: 16.0 }
      },
      {
        name: "glm-4",
        provider: "zhipu",
        desc: "通用场景",
        aliyun: { input: 2.0, output: 8.0 },
        bytedance: null
      }
    ]
  },
  // Changes detected in the last 7 days
  changes: [
    // Format: { date: "YYYY-MM-DD", type: "price_change"|"new_model", provider: "aliyun"|"bytedance", model: "name", level: "Flagship", field: "input"|"output", old: number, new: number, pctChange: number }
    // Note: Populated by daily update process when changes are detected
  ],
  // History data
  history: {
    dates: ["2026-03-27", "2026-03-26", "2026-03-25", "2026-03-24", "2026-03-23", "2026-03-22", "2026-03-21", "2026-03-20"],
    models: {
      // language models - lowest tier input/output
      "qwen3-max": { input: [2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5], output: [10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0] },
      "qwen3.5-plus": { input: [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8], output: [4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8] },
      "qwen3.5-flash": { input: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2], output: [2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0] },
      "doubao-seed-2.0-pro": { input: [3.2, 3.2, 3.2, 3.2, 3.2, 3.2, 3.2, 3.2], output: [16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0] },
      "doubao-seed-2.0-lite": { input: [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6], output: [3.6, 3.6, 3.6, 3.6, 3.6, 3.6, 3.6, 3.6] },
      "doubao-seed-2.0-mini": { input: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2], output: [2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0] },
      "doubao-seed-1.6-flash": { input: [0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15], output: [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5] },
      "doubao-1.5-pro-32k": { input: [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8], output: [2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0] },
      "doubao-1.5-lite-32k": { input: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3], output: [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6] },
      // code models
      "qwen3-coder-plus": { input: [4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0], output: [16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0] },
      "qwen-coder-turbo": { input: [2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0], output: [6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0] },
      "qwq-32b": { input: [1.6, 1.6, 1.6, 1.6, 1.6, 1.6, 1.6, 1.6], output: [4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0] },
      "doubao-seed-2.0-code": { input: [3.2, 3.2, 3.2, 3.2, 3.2, 3.2, 3.2, 3.2], output: [16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0] },
      "doubao-seed-code": { input: [1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2], output: [8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0] },
      // vision models
      "qwen-vl-max": { input: [1.6, 1.6, 1.6, 1.6, 1.6, 1.6, 1.6, 1.6], output: [4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0] },
      "qwen3-vl-plus": { input: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], output: [10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0] },
      "qwen-omni": { input: [1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8], output: [6.9, 6.9, 6.9, 6.9, 6.9, 6.9, 6.9, 6.9] },
      "qvq-max": { input: [8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0], output: [32.0, 32.0, 32.0, 32.0, 32.0, 32.0, 32.0, 32.0] },
      "doubao-1.5-vision-pro": { input: [3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0], output: [9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0] },
      "doubao-1.5-vision-lite": { input: [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5], output: [4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5] },
      "doubao-seed-1.6-vision": { input: [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8], output: [8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0] }
    }
  }
};

