import * as React from "react";
import { Html } from "@react-email/html";
import {
  Body,
  Head,
  Heading,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import type { SessionMetadata } from "../../../../shared/types/session-metadata.types";

interface DeactivateTemplateProps {
  token: string;
  metadata: SessionMetadata;
}

export function DeactivateTemplate({
  metadata,
  token,
}: DeactivateTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Деактивация аккаунта</Preview>
      <Tailwind>
        <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
          <Section className="text-center mb-8">
            <Heading className="text-3xl text-black font-bold">
              Запрос на деактивацию аккаунта
            </Heading>
            <Text className="text-black text-base mt-2">
              Вы инициировали процесс деактивациии вашего аккаунта на платформе{" "}
              <b>PricidonStream</b>.
            </Text>
          </Section>
          <Section className="bg-gray-100 rounded-lg text-center mb-6">
            <Heading className="text-2xl text-black font-semibold">
              Код подтверждения:
            </Heading>
            <Heading className="text-3xl text-black font-semibold">
              {token}
            </Heading>
            <Text className="text-black">
              Этот код действетелен в течение 5 минут
            </Text>
          </Section>
          <Section className="bg-gray-100 rounded-lg p-6 mb-6">
            <Heading className="text-xl font-semibold text-[#18b9ae]">
              Информация о запросе:
            </Heading>
            <ul className="list-disc list-inside text-black mt-2">
              <li>
                🌍 Расположение: {metadata.location.country},{" "}
                {metadata.location.city}
              </li>
              <li>📱 Операционная система: {metadata.device.os}</li>
              <li>🌐 Браузер: {metadata.device.browser}</li>
              <li>💻 IP-адрес: {metadata.ip}</li>
            </ul>
            <Text className="text-gray-600 mt-2">
              Если вы не инициировали этот запрос, пожалуйста, игнорируйте это
              сообщение.
            </Text>
          </Section>
          <Section className="text-center mt-8">
            <Text className="text-gray-600">
              Если у вас есть вопросы или вы столкнулись с трудностями, не
              стесняйтесь обращаться в нашу службу поддержки по адресу
              <Link
                href="mailto:help@pricidon.ru"
                className="text-[#18b9ae] underline"
              >
                help@pricidon.ru
              </Link>
              .
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
