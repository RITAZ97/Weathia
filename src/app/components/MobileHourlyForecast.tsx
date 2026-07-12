"use client";
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { WeatherData } from '@/types/weather';
import { useRouter } from 'next/navigation';
import { User, CheckoutSessionResponse } from '@/types/weather';

interface MobileHourlyForecastProps {
  weather: WeatherData | null;
  weatherData?: any[];
}

const MobileHourlyForecast: React.FC<MobileHourlyForecastProps> = ({ weather }) => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const router = useRouter();
  const isPremium = !!(session as any)?.user?.isPremium;
  const maxAllowedHours = isPremium ? 48 : (isLoggedIn ? 24 : 12);
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const handleUpgrade = async (): Promise<void> => {
    if (!session?.user) {
      signIn();
      return;
    }

    setIsPaymentLoading(true);
    try {
      const priceId = 'price_1TkMKsDrnf9PBdtp4VX9Q6A7';
      console.log('--- Preparing data for backend ---');
      console.log('Current user session:', session);
      console.log('Retrieved userId:', (session?.user as any)?.id);
      console.log('Retrieved priceId:', priceId);
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.email,
          priceId: priceId,
        }),
      });

      const data: CheckoutSessionResponse = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Stripe error:', error);
      alert('Network error, please try again later');
    } finally {
      setIsPaymentLoading(false);
    }
  };



  const hourlyData = weather?.hourly?.slice(0, maxAllowedHours).map((item, index) => {
    const itemDate = new Date(item.dt * 1000);
    const itemDateStr = itemDate.toLocaleDateString();
    const dayInfo = weather.daily.find(d =>
      new Date(d.dt * 1000).toLocaleDateString() === itemDateStr
    );
    const sunrise = dayInfo?.sunrise || weather.daily[0].sunrise;
    const sunset = dayInfo?.sunset || weather.daily[0].sunset;
    const isDaylight = item.dt > sunrise && item.dt < sunset;
    let weatherMain = item.weather[0].main.toLowerCase();
    let iconName = weatherMain;
    if (weatherMain === 'clear') {
      iconName = isDaylight ? 'clear-day' : 'clear-night';
    }
    const timezoneOffset = weather.timezone_offset || 0;

    return {
      ...item,
      displayTime: new Date((item.dt + timezoneOffset) * 1000).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      }),
      temp: Math.round(item.temp),
      iconName: iconName
    };
  }) || [];

  return (
    <div className="flex justify-center items-center mx-auto w-full">
      <div className="w-full max-w-[330px] flex justify-center items-center py-3">
        <div className="flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar pb-1">
          {hourlyData.map((item, id) => (
            <div
              key={id}
              className="flex-none w-[22%] snap-start flex flex-col items-center group"
            >
              <div className="w-12 h-12 rounded-full bg-support2 flex justify-center items-center mb-3"
                style={{
                  border: id === 0 || id === 24 ? '3px solid #04DBAC' : 'none',
                }}>
                <img
                  src={`/icons/${item.iconName}.svg`}
                  className="w-5 h-auto object-contain"
                  alt="weather"
                />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <h3 className="text-ternary font-medium uppercase">
                  {id === 0 ? "Now" : item.displayTime}
                </h3>
                <h2 className="text-ternary font-semibold">
                  {item.temp}°
                </h2>
              </div>
            </div>
          ))}
          {!isLoggedIn && (
            <div
              className="flex-none w-[35%] snap-start flex flex-col items-center justify-center border border-dashed border-gray-500 rounded-xl ml-2 p-2 bg-black/20 cursor-pointer hover:bg-black/30 transition-all"
              onClick={() => {
                if (!isPaymentLoading && handleUpgrade) {
                  handleUpgrade();
                }
              }}
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex justify-center items-center mb-2">
                <span className="text-[14px]">🔒</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium text-center leading-tight">
                Log in to<br />unlock 24h
              </p>
            </div>
          )}

          {/* 💡 状态2：已登录但不是 Premium，显示升级解锁 48h 提示 */}
          {isLoggedIn && !isPremium && (
            <div
              className="flex-none w-[35%] snap-start flex flex-col items-center justify-center border border-dashed border-[#04DBAC]/40 rounded-xl ml-2 p-2 bg-black/20 cursor-pointer hover:bg-[#04DBAC]/5 transition-all animate-fadeIn"
              onClick={handleUpgrade}
            >
              {/* 💡 重点：这里的圆圈完全套用你之前满意的 3px #04DBAC 边框与缩放逻辑，完美呼应前面的 id=0/24 */}
              <div
                className="w-12 h-12 rounded-full flex justify-center items-center bg-support2/10 lg:bg-support2 transition-all duration-300 mb-2"
              >
                <img
                  src={`/icons/user-premium.svg`}
                  className="w-7 h-auto object-contain"
                  alt="VIP"
                />
              </div>

              <p className="text-[12px] font-semibold text-center leading-tight">
                Upgrade to<br />unlock 48h
              </p>
            </div>
          )}
        </div> s
      </div>
    </div>
  );
};

export default MobileHourlyForecast; 