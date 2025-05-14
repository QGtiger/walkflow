import { AuthLoginLayout } from '@/Layouts/AuthLogin';
import Header from './components/Header';
import Main from './components/Main';
import { DashboardModel } from './model';

export default function Dashboard() {
  return (
    <AuthLoginLayout>
      <DashboardModel.Provider>
        <div className="flex flex-col h-screen ">
          <Header />
          <Main />
        </div>
      </DashboardModel.Provider>
    </AuthLoginLayout>
  );
}
