interface WalkflowDashboardItem {
  flowId: string;
  flowName: string;
  thumbnail: string;
  createdAt: number;
  updatedAt: number;
  flowStatus: 'draft' | 'published';
}
