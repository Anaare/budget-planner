function Dashboard() {
  return (
    <>
      <h1 className="text-3xl font-bold m-2 text-foreground">
        Welcome to your Dashboard!
      </h1>
      <p className="m-2">Financial Overview</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-lg shadow">Card 1</div>
        <div className="bg-gray-900 p-6 rounded-lg shadow">Card 2</div>
        <div className="bg-gray-900 p-6 rounded-lg shadow">Card 3</div>
        <div className="bg-gray-900 p-6 rounded-lg shadow">Card 4</div>
        <div className="bg-gray-900 p-6 rounded-lg shadow">Card 5</div>
        <div className="bg-gray-900 p-6 rounded-lg shadow">Card 5</div>
      </div>
    </>
  );
}

export default Dashboard;
