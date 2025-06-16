package com.hotel.webapp.config;

import com.hotel.webapp.service.system.SystemSeeder;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
//@DependsOn("entityManagerFactory")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class SeederRunner implements CommandLineRunner {
  SystemSeeder systemSeeder;
  // java -jar target/webapp-0.0.1-SNAPSHOT.jar seeder-permission
  @Override
  public void run(String... args) throws Exception {
    if(args.length > 0 && "seeder-permission".equals(args[0])) {
      systemSeeder.seeder();
    }
  }
}
