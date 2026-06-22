import type { Point } from "@/types/trace"

export function normalizePath(points: Point[]): Point[] {
  if (points.length === 0) return []

  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  const width = maxX - minX || 1
  const height = maxY - minY || 1

  return points.map((p) => ({
    x: (p.x - minX) / width,
    y: (p.y - minY) / height,
  }))
}

function resample(points: Point[], n: number): Point[] {
  if (points.length === 0) return []
  if (points.length === 1) return Array(n).fill(points[0])
  const result: Point[] = [points[0]]
  let totalLen = 0
  const segments: number[] = [0]
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    totalLen += Math.sqrt(dx * dx + dy * dy)
    segments.push(totalLen)
  }
  const step = totalLen / (n - 1)
  for (let i = 1; i < n - 1; i++) {
    const target = i * step
    let seg = 1
    while (seg < segments.length - 1 && segments[seg] < target) seg++
    const t = (target - segments[seg - 1]) / (segments[seg] - segments[seg - 1])
    result.push({
      x: points[seg - 1].x + t * (points[seg].x - points[seg - 1].x),
      y: points[seg - 1].y + t * (points[seg].y - points[seg - 1].y),
    })
  }
  result.push(points[points.length - 1])
  return result
}

export function comparePaths(
  userPath: Point[],
  referencePath: Point[],
  sampleCount = 32
): number {
  if (userPath.length < 2) return 0

  const normalUser = normalizePath(resample(userPath, sampleCount))
  const normalRef = normalizePath(resample(referencePath, sampleCount))

  let totalDist = 0
  for (let i = 0; i < sampleCount; i++) {
    const dx = normalUser[i].x - normalRef[i].x
    const dy = normalUser[i].y - normalRef[i].y
    totalDist += Math.sqrt(dx * dx + dy * dy)
  }

  const avgDist = totalDist / sampleCount
  const score = Math.max(0, 1 - avgDist * 2)
  return score
}
