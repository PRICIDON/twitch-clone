import { ConfigService } from "@nestjs/config";
import type { ApolloDriverConfig } from "@nestjs/apollo";
import { isDev } from "../../shared/utils/is-dev.util";
import { join } from "path";

export function getGraphQLConfig(
  configService: ConfigService,
): ApolloDriverConfig {
  return {
    playground: isDev(configService),
    path: configService.getOrThrow<string>("GRAPHQL_PREFIX"),
    autoSchemaFile: join(process.cwd(), "src/core/graphql/schema.gql"),
    sortSchema: true,
    context: ({ res, rej }) => ({ res, rej }),
  };
}
