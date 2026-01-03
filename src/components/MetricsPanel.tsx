import { useEffect, useMemo, useRef } from 'react'
import * as d3 from 'd3'
import type {
  ComparisonMode,
  SimulationResult,
  SimSample,
} from '../engine/stateMachine'
import { SIMULATION_CONSTANTS } from '../engine/simulationStep'

interface MetricsPanelProps {
  mode: ComparisonMode
  withResult: SimulationResult
  withoutResult: SimulationResult
}

const formatRecovery = (value: number | null) =>
  value === null ? '—' : `${value.toFixed(0)}s`

const MetricCard = ({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: string
}) => (
  <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4">
    <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">
      {label}
    </p>
    <p className={`mt-2 text-2xl font-semibold ${accent ?? 'text-white'}`}>
      {value}
    </p>
  </div>
)

const buildSeries = (samples: SimSample[]) =>
  samples.map((sample) => ({
    time: sample.timeSec,
    value: sample.errMagnitude,
  }))

const MetricsPanel = ({ mode, withResult, withoutResult }: MetricsPanelProps) => {
  const chartRef = useRef<SVGSVGElement | null>(null)

  const series = useMemo(() => {
    if (mode === 'with') return [{ data: buildSeries(withResult.samples), color: '#22d3ee' }]
    if (mode === 'without')
      return [{ data: buildSeries(withoutResult.samples), color: '#f97316' }]
    return [
      { data: buildSeries(withoutResult.samples), color: '#f97316' },
      { data: buildSeries(withResult.samples), color: '#22d3ee' },
    ]
  }, [mode, withResult, withoutResult])

  useEffect(() => {
    if (!chartRef.current) return

    const svg = d3.select(chartRef.current)
    svg.selectAll('*').remove()

    const width = 460
    const height = 160
    const margin = { top: 20, right: 18, bottom: 20, left: 36 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const allPoints = series.flatMap((line) => line.data)
    const maxY = d3.max(allPoints, (d: { value: number }) => d.value) ?? 1

    const xScale = d3
      .scaleLinear()
      .domain([0, SIMULATION_CONSTANTS.durationSec])
      .range([0, innerWidth])

    const yScale = d3.scaleLinear().domain([0, maxY]).range([innerHeight, 0])

    const root = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    root
      .append('g')
      .attr('stroke', 'rgba(255,255,255,0.1)')
      .attr('stroke-width', 1)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(5)
          .tickSizeOuter(0)
          .tickFormat((value) => `${value}s`)
      )
      .attr('transform', `translate(0,${innerHeight})`)
      .selectAll('text')
      .attr('fill', 'rgba(255,255,255,0.45)')
      .attr('font-size', 10)

    root
      .append('g')
      .attr('stroke', 'rgba(255,255,255,0.1)')
      .attr('stroke-width', 1)
      .call(d3.axisLeft(yScale).ticks(4).tickSizeOuter(0))
      .selectAll('text')
      .attr('fill', 'rgba(255,255,255,0.45)')
      .attr('font-size', 10)

    const line = d3
      .line<{ time: number; value: number }>()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.value))

    series.forEach((serie) => {
      root
        .append('path')
        .datum(serie.data)
        .attr('fill', 'none')
        .attr('stroke', serie.color)
        .attr('stroke-width', 2.5)
        .attr('d', line)
    })
  }, [series])

  const primaryResult = mode === 'without' ? withoutResult : withResult

  return (
    <section className="grid gap-6 rounded-3xl border border-white/10 bg-slate-950/70 p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Max Positional Error"
          value={`${primaryResult.maxErrorKm.toFixed(1)} km`}
          accent="text-cyan-200"
        />
        <MetricCard
          label="Recovery Time"
          value={formatRecovery(primaryResult.recoveryTimeSec)}
        />
        <MetricCard
          label="Safety Status"
          value={primaryResult.safetyStatus}
          accent={
            primaryResult.safetyStatus === 'maintained'
              ? 'text-emerald-300'
              : 'text-rose-300'
          }
        />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">
          Position Error Over Time
        </p>
        <svg ref={chartRef} className="mt-3 h-44 w-full" />
      </div>
    </section>
  )
}

export default MetricsPanel
