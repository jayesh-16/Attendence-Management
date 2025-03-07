
// For the progress bars, use className to style them
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <div className="status-indicator bg-present"></div>
      <span className="text-sm font-medium">Present</span>
    </div>
    <span className="text-sm font-medium">{presentPercentage}%</span>
  </div>
  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
    <div 
      className="h-full bg-green-500 transition-all"
      style={{ width: `${presentPercentage}%` }}
    ></div>
  </div>
</div>

<div className="space-y-2">
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <div className="status-indicator bg-absent"></div>
      <span className="text-sm font-medium">Absent</span>
    </div>
    <span className="text-sm font-medium">{absentPercentage}%</span>
  </div>
  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
    <div 
      className="h-full bg-red-500 transition-all"
      style={{ width: `${absentPercentage}%` }}
    ></div>
  </div>
</div>

<div className="space-y-2">
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <div className="status-indicator bg-late"></div>
      <span className="text-sm font-medium">Late</span>
    </div>
    <span className="text-sm font-medium">{latePercentage}%</span>
  </div>
  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
    <div 
      className="h-full bg-amber-500 transition-all"
      style={{ width: `${latePercentage}%` }}
    ></div>
  </div>
</div>
