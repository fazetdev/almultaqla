// ServicesChart - Generic services/products chart
// Shows top services, products, or items based on business type

interface ServicesChartProps {
  data?: Array<{ name: string; value: number }>;
  title?: string;
  isLoading?: boolean;
}

export const ServicesChart: React.FC<ServicesChartProps> = ({
  data = [],
  title = "Top Items",
  isLoading = false
}) => {
  if (isLoading) {
    return <div>Loading chart data...</div>;
  }

  if (!data.length) {
    return <div>No data available for {title}</div>;
  }

  // Chart implementation will come from backend data
  return (
    <div className="services-chart">
      <h4>{title}</h4>
      <div className="chart-placeholder">
        Chart visualization will appear here with real data
      </div>
    </div>
  );
};
