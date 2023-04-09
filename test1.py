from redis_om import (
    HashModel,
    Migrator,
    Field
)
from redis import Redis


url = "redis://default:wF6cuLb4mtLypFQ0fOEdUxvYhpOGwVMW@redis-12534.c100.us-east-1-4.ec2.cloud.redislabs.com:12534"


class User(HashModel):
    name: str
    phone: str = Field(index=True)

    class Meta:
        database = Redis(
            host="redis-12534.c100.us-east-1-4.ec2.cloud.redislabs.com",
            port=12534,
            username="default",
            password="wF6cuLb4mtLypFQ0fOEdUxvYhpOGwVMW"
        )


class Implementor:
    def create_user(self, name, phone):
        user = User(
            name=name,
            phone=phone
        )

        user.save()

        return user

    def check_user(self, phone):
        try:
            user = User.find(User.phone == phone).first()
            return user
        except:
            return None


# if __name__ == "__main__":
#     Migrator().run()

#     implementor = Implementor()

#     user = implementor.check_user("254708421366")

#     print(user)
