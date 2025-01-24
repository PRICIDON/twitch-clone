'use client'

import {useTranslations} from "next-intl";
import { useCurrent } from '@/hooks/useCurrent'


export default function HomePage() {

  const t = useTranslations('home')
  const {user, isLoadingProfile}=useCurrent()

  return (
    <div className="text-4xl font-bold">
        {isLoadingProfile ? <div>Loading...</div> :
            <div className="">

            </div>
        }

    </div>
  );
}
