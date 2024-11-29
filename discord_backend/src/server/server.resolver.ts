import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class ServerResolver {

    @Query(() => String)
    async helloWorldQuery() {
        return 'Hello Rohan';
    }
}
